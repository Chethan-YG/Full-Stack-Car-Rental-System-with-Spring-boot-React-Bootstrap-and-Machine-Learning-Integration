import React, { useState } from "react";
import Swal from "sweetalert2";
import Loader from "./Loader";

const Damage = () => {
  const [file, setFile] = useState(null);
  const [fileBefore, setFileBefore] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileBeforeChange = (event) => {
    setFileBefore(event.target.files[0]);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (!file) {
      console.error("No file selected for upload");
      Swal.fire("Error", "No file selected for upload", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://localhost:5000/receiveImage`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const blob = await response.blob(); 
      const processedImageURL = URL.createObjectURL(blob);
      setProcessedImage(processedImageURL);
      setLoading(false);
      Swal.fire(
        "Success",
        "Image uploaded and processed successfully",
        "success"
      );
    } catch (error) {
      console.error("Error uploading image:", error.message);
      Swal.fire("Error", "Failed to upload image", "error");
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="Dashboardcontainer">
        <div>
          <div className="d-flex justify-content-center px-4">
            <div className="form-group mb-4">
              <label htmlFor="fileBefore" className="form-label">
                Upload Image Before Damage (.jpg or .jpeg only):
              </label>
              <input
                type="file"
                id="fileBefore"
                accept=".jpg, .jpeg"
                onChange={handleFileBeforeChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="d-flex justify-content-center"
          >
            <div>
              <div className="form-group mb-4">
                <label htmlFor="file" className="form-label">
                  Upload Image After Damage &nbsp;&nbsp; (.jpg or .jpeg only):
                </label>
                <input
                  type="file"
                  id="file"
                  accept=".jpg, .jpeg"
                  onChange={handleFileChange}
                  className="form-control"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-danger px-5 rounded-0 fs-4 fw-bold"
              >
                UPLOAD
              </button>
            </div>
          </form>
        </div>
        <div></div>

        <div className="d-flex justify-content-center">
          <div className="col-md-9 d-flex justify-content-around mt-5 p-5">
            <div className="col-md-4">
              {fileBefore && (
                <h3 className="text-center  fw-bold">Before Damage</h3>
              )}
              {fileBefore && (
                <img
                  src={URL.createObjectURL(fileBefore)}
                  alt="Before Damage"
                  className="img-fluid mb-4"
                  style={{
                    height: "400px",
                    width: "100%",
                    aspectRatio: 3 / 2,
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
            <div className="col-md-5">
              {file && <h3 className="text-center  fw-bold">After Damage</h3>}
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Car Preview"
                  className="img-fluid mb-4"
                  style={{
                    height: "400px",
                    width: "100%",
                    aspectRatio: 3 / 2,
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
            <div className="col-md-5">
              {processedImage && (
                <h3 className="text-center  fw-bold">Predicted Image</h3>
              )}
              {processedImage && (
                <img
                  src={processedImage}
                  alt="Processed"
                  className="img-fluid mb-4"
                  style={{
                    height: "400px",
                    width: "100%",
                    aspectRatio: 3 / 2,
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Damage;
