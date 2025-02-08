import argparse
import os
import cv2
from flask import Flask, request, send_file, jsonify
from werkzeug.utils import secure_filename
from ultralytics import YOLO
from flask_cors import CORS

os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
os.environ['OMP_NUM_THREADS'] = '1'

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

UPLOAD_FOLDER = 'uploads'
PREDICTIONS_FOLDER = 'runs/detect'  # Folder where the detected images are stored
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'mp4'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PREDICTIONS_FOLDER'] = PREDICTIONS_FOLDER

# Check if the upload folder exists, create it if it doesn't
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_latest_file(folder_path):
    subfolders = [f for f in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, f))]
    if subfolders:
        latest_subfolder = max(subfolders, key=lambda x: os.path.getctime(os.path.join(folder_path, x)))
        latest_subfolder_path = os.path.join(folder_path, latest_subfolder)
        files = [f for f in os.listdir(latest_subfolder_path) if os.path.isfile(os.path.join(latest_subfolder_path, f))]
        if files:
            latest_file = max(files, key=lambda x: os.path.getctime(os.path.join(latest_subfolder_path, x)))
            return os.path.join(latest_subfolder_path, latest_file)
    return None

@app.route("/receiveImage", methods=["POST"])
def receive_image():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"message": "Invalid file type"}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    # Image processing using YOLO
    model = YOLO('best.pt')
    file_extension = filename.rsplit('.', 1)[1].lower()

    if file_extension in {'jpg', 'jpeg', 'png'}:
        img = cv2.imread(filepath)
        results = model(img, save=True)
    elif file_extension == 'mp4':
        video_path = filepath
        cap = cv2.VideoCapture(video_path)
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter('output.mp4', fourcc, 30.0, (frame_width, frame_height))

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            results = model(frame, save=True)
            res_plotted = results[0].plot()
            out.write(res_plotted)
        cap.release()
        out.release()
    
    # Find the latest processed image or video
    latest_file_path = get_latest_file(app.config['PREDICTIONS_FOLDER'])
    if latest_file_path:
        mimetype = 'image/jpeg' if latest_file_path.endswith(('jpg', 'jpeg', 'png')) else 'video/mp4'
        return send_file(latest_file_path, mimetype=mimetype)
    
    return jsonify({"message": "No processed file found"}), 500

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Flask app exposing YOLO models")
    parser.add_argument("--port", default=5000, type=int, help="port number")
    args = parser.parse_args()
    app.run(host="0.0.0.0", port=args.port)
