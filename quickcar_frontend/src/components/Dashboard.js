import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Swal from "sweetalert2";
import apiClient from "../utils/apiClient";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole") || "");

    const fetchCars = async () => {
      try {
        const { data } = await apiClient.get("/api/customer/cars");
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/update-car/${id}`);
  };

  const handleDelete = (carId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .delete(`/api/admin/cars/${carId}`)
          .then(() => {
            setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
            Swal.fire("Deleted!", "The car has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting car:", error);
            Swal.fire(
              "Error!",
              "There was an error deleting the car.",
              "error"
            );
          });
      }
    });
  };

  const handleBook = (carId) => {
    navigate(`/book-car/${carId}`);
  };

  return (
    <div className="Dashboardcontainer">
      <h2 className="text-center fw-bold mb-4">AVAILABLE CARS</h2>
      {cars.map((car, index) => (
        <div key={index} className="card mb-4 p-3 rounded-0 shadow">
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={car.imageUrl}
                className="img-fluid rounded-start"
                alt={car.name}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body py-0">
                <h1 className="card-title fw-bold">
                  {car.brand} {car.name}
                </h1>
                <div className="row mb-0">
                  <div className="col-md-6 mb-3">
                    <p className="card-text">
                      <i className="bi bi-car-front"></i> <strong>Type:</strong>{" "}
                      {car.type}
                    </p>
                    <p className="card-text">
                      <i className="bi bi-gear"></i>{" "}
                      <strong>Transmission:</strong> {car.transmission}
                    </p>
                    <p className="card-text">
                      <i className="bi bi-palette"></i> <strong>Color:</strong>{" "}
                      {car.color}
                    </p>
                    <p className="card-text">
                      <i className="bi bi-speedometer"></i>{" "}
                      <strong>Odometer:</strong> {car.odometer} KM
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <p className="card-text">
                      <i className="bi bi-calendar"></i> <strong>Model:</strong>{" "}
                      {car.year}
                    </p>
                    <p className="card-text">
                      <i className="bi bi-cash"></i> <strong>Price:</strong> ₹
                      {car.price}/day
                    </p>
                    <p className="card-text">
                      <i className="bi bi-fuel-pump"></i>{" "}
                      <strong>Fuel Type:</strong> {car.fuelType}
                    </p>
                    <p className="card-text">
                      <i className="bi bi-receipt me-2"></i>
                      <a href={car.invoiceUrl} target="_blank" rel="noreferrer">
                        <strong className="fs-4 ps-1">
                          OPEN SERVICE INVOICE
                        </strong>
                      </a>
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  {userRole === "ADMIN" ? (
                    <>
                      <button
                        className="btn btn-warning rounded-0 me-2 fs-3 px-5 mt-1"
                        onClick={() => handleUpdate(car.id)}
                      >
                        UPDATE
                      </button>
                      <button
                        className="btn btn-danger rounded-0 fs-3 px-5 mt-1"
                        onClick={() => handleDelete(car.id)}
                      >
                        DELETE
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary rounded-0 fs-3 px-5 mt-1"
                      onClick={() => handleBook(car.id)}
                    >
                      BOOK
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
