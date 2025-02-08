import React, { useEffect, useState,useCallback } from "react";
import { DatePicker } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../utils/apiClient"; 
import Loader from "./Loader";
import "./BookCarDetails.css";

const BookCarDetails = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [licenseImage, setLicenseImage] = useState(null);
  const navigate = useNavigate();


useEffect(() => {
  const fetchCarData = async () => {
    try {
      const [carData, datesData] = await Promise.all([
        apiClient.get(`/api/customer/cars/${carId}`),
        apiClient.get(`/api/customer/cars/${carId}/booked-dates`),
      ]);

      setCar(carData.data);

      const newBlockedDates = new Set();
      datesData.data
        .filter(booking => booking.bookCarStatus !== "CANCELLED")
        .forEach(booking => {
          let currentDate = new Date(booking.fromDate);
          const endDate = new Date(booking.toDate);
          while (currentDate <= endDate) {
            newBlockedDates.add(currentDate.toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

      setBlockedDates(newBlockedDates);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error!", "There was an error fetching data.", "error");
    } finally {
      setLoading(false);
    }
  };

  fetchCarData();
}, [carId]);

  const isDateBlocked = useCallback(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today || blockedDates.has(date.toISOString().split("T")[0]);
    },
    [blockedDates]
  );

  const handleFileChange = useCallback((event) => {
    setLicenseImage(event.target.files[0]);
  }, []);

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!fromDate || !toDate || !licenseImage) {
    Swal.fire("Error!", "Please select both dates and upload a license image.", "error");
    return;
  }

  setLoading(true);

  const days = Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    Swal.fire("Error!", "Invalid date range.", "error");
    setLoading(false);
    return;
  }

  const price = car.price * days;
  const userId = localStorage.getItem("userId");

  const formData = new FormData();
  formData.append(
    "car",
    JSON.stringify({
      carId: car.id,
      userId: userId,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      days: days,
      price: price,
      bookCarStatus: "PENDING",
    })
  );
  formData.append("licenseImage", licenseImage);

  try {
    await apiClient.post("/api/customer/car/book", formData, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });

    Swal.fire("Booked!", "Your car has been booked.", "success");
    navigate("/Bookings");
  } catch (error) {
    console.error("Error booking car:", error);
    Swal.fire("Error!", "There was an error booking the car.", "error");
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return <Loader />;
  }

  if (!car) {
    return <p>Car details not found.</p>;
  }

  return (
    <div className="book-car-container">
      <h2 className="text-center fw-bold mb-4">Book your Car</h2>
      <div className="card mb-4 p-3 rounded-0">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={car.imageUrl}
              className="img-fluid rounded-start"
              alt={car.name}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body p-0 ps-3">
              <h1 className="card-title fw-bold mb-1">
                {car.brand} {car.name}
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fromDate" className="form-label">From Date</label>
                  <div className="input-group">
                    <DatePicker
                      value={fromDate}
                      onChange={setFromDate}
                      disabledDate={isDateBlocked}
                      format="DD/MM/YYYY"
                      placeholder="DD/MM/YYYY"
                      className="form-control fs-4 py-0"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="toDate" className="form-label">To Date</label>
                  <div className="input-group">
                    <DatePicker
                      value={toDate}
                      onChange={setToDate}
                      disabledDate={isDateBlocked}
                      format="DD/MM/YYYY"
                      placeholder="DD/MM/YYYY"
                      className="form-control fs-4 py-0"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="licenseImage" className="form-label">Upload License Image</label>
                  <input
                    type="file"
                    id="licenseImage"
                    name="licenseImage"
                    className="form-control"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div className="d-flex justify-content-end mt-5">
                  <button type="submit" className="btn btn-primary rounded-0 fs-3 px-5">
                    BOOK
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCarDetails;

