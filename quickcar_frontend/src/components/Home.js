import React, { useState} from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Swal from "sweetalert2";
import Loader from "./Loader";
import apiClient from "../utils/apiClient";
import Testimonials from "./Testimonials";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCallSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const response = await apiClient.post("/api/callback/call", formData);


      Swal.fire({
        title: "Success!",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "OK",
      });

      setFormData({
        name: "",
        phoneNumber: "",
      });
      handleClose();
    } catch (error) {
      console.error("There was an error sending the callback request!", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "There was an error submitting the request. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const username = localStorage.getItem("username");

  return (
    <>
      {loading && <Loader />}
      <div className="Homecontainer d-grid p-5">
        <div>
          <p className="Home-title">Hello {username}, welcome to QuickCar!</p>
        </div>
        <div>
          <p className="Home-subtitle">
            WE ARE OPEN 24/7 INCLUDING MAJOR HOLIDAYS
          </p>
          <p className="Home-a">PLAN YOUR TRIP WITH QUICKCAR</p>
          <p className="fs-3 Home-b">
            Rent a Car Online Today & Enjoy the Best Deals, Rates & Accessories.
          </p>
          <Link to="/dashboard">
            <button className="dash-button fw-bold">BROWSE THE FLEET</button>
          </Link>
        </div>
      </div>

      <div className="mycontainer mt-5">
        <div className="d-flex justify-content-center mb-4">
          <p className="display-1 fw-bold">RENTAL VEHICLES</p>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="image-container crossovers rounded-0">
              <div className="overlay">
                <p className="title mb-5">Cars & Crossovers</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="image-container luxury rounded-0">
              <div className="overlay">
                <p className="title mb-5">Luxury Cars</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="image-container suv rounded-0">
              <div className="overlay">
                <p className="title mb-5">SUVs & Vans</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="call my-5 p-5">
        <p className="display-6 fw-bold call-text mt-5">
          Make a reservation today without any surprises on extra charges at the
          pick up location
        </p>
        <button className="dash-button fw-bold" onClick={handleShow}>
          REQUEST A CALLBACK
        </button>
      </div>

      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="exampleModalLabel">
                REQUEST A CALLBACK
              </h1>
              <button
                type="button"
                className="close border-0 bg-white fs-1 ms-auto"
                onClick={handleClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body p-5">
              <form onSubmit={handleCallSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-person fs-4"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control py-2 fs-4"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white fs-4">+91</span>
                    <input
                      type="text"
                      className="form-control py-2 fs-4"
                      id="phoneNumber"
                      name="phoneNumber"
                      maxLength={10}
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="register-button text-center"
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}

      <Testimonials />

      <div className="drive-fleet p-5">
        <div className="flex-column align-items-start text-start">
          <div className="text-white display-2 my-5 fw-bold">
            <span className="driver-text">DRIVE</span> ASSIST
          </div>
          <div className="drive-assist-home-container text-white">
            <div className="row d-flex justify-content-between">
              <div className="col-md-5">
                <div className="h4 mb-5 fw-bold">
                  <p className="text-white display-6 mt-3 mb-5 fw-bold">
                    Drive with Confidence: Hire Your Ideal Driver!
                  </p>
                </div>
                <div>
                  <p className="text-start h4">
                    Select from a roster of skilled, punctual drivers—each with
                    a unique flair. Whether you prefer a friendly
                    conversationalist or a zen-like chauffeur, we’ve got you
                    covered.Our drivers know the roads like the back of their
                    hands, ensuring a smooth ride every time.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <Link to="/drive">
              <button className="dash-button fw-bold">STEERING FLEET</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
