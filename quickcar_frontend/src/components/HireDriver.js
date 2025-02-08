import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../utils/apiClient"; 
import Loader from "./Loader";

const HireDriver = () => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await apiClient.get(`/api/customer/driver/${driverId}`);
        setDriver(response.data);
      } catch (error) {
        console.error("Error fetching driver details:", error);
        Swal.fire("Error!", "Could not fetch driver details.", "error");
      }
    };

    const fetchBlockedDates = async () => {
      try {
        const response = await apiClient.get(`/api/customer/driver/${driverId}/booked-dates`);
        const filteredDates = response.data.filter(
          (booking) => booking.HireDriverStatus !== "CANCELLED"
        );
    
        const newBlockedDates = new Set();
        filteredDates.forEach((booking) => {
          let currentDate = new Date(booking.fromDate);
          const endDate = new Date(booking.toDate);
          while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split("T")[0];
            newBlockedDates.add(dateString);
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
        setBlockedDates(newBlockedDates);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriverDetails();
    fetchBlockedDates();
  }, [driverId]);

  const isDateBlocked = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateString = date.toISOString().split("T")[0];
    return date < today || blockedDates.has(dateString);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    if (!fromDate || !toDate) {
      Swal.fire("Error!", "Please select both dates.", "error");
      setLoading(false);
      return;
    }
  
    const days = Math.ceil(
      (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
    );
    if (days <= 0 || Array.from({ length: days }, (_, i) => {
      const testDate = new Date(fromDate);
      testDate.setDate(testDate.getDate() + i);
      return isDateBlocked(testDate);
    }).includes(true)) {
      Swal.fire("Error!", "Selected dates overlap with blocked dates.", "error");
      setLoading(false);
      return;
    }
  
    const wage = driver.wage * days;
    const userId = localStorage.getItem("userId");
  
    try {
      await apiClient.post("/api/customer/driver/hire", {
        driverId: driver.id,
        userId: userId,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        days: days,
        wage: wage,
        HireDriverStatus: "PENDING",
      });
  
      Swal.fire("Hired!", "Your driver has been hired.", "success");
      navigate("/Bookings");
    } catch (error) {
      console.error("Error hiring driver:", error);
      Swal.fire("Error!", "There was an error hiring the driver.", "error");
    } finally {
      setLoading(false);
    }
  };
  
  if (!driver) {
    return <p>Driver details not found.</p>;
  }

  return (
    <>
      {loading && <Loader />}
      <div className="Drivers-container">
        <h2 className="text-center fw-bold mb-4">Hire Driver</h2>
        <div className="d-flex justify-content-center">
          <div className="card mb-4 p-3 rounded-0 col-md-8 shadow">
            <div className="row g-0 d-flex justify-content-center">
              <div className="col-md-3">
                <img
                  src={driver.profilePicUrl}
                  className="img-fluid rounded-start"
                  alt={driver.name}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h1 className="card-title fw-bold">{driver.name}</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="fromDate" className="form-label">
                        From Date
                      </label>
                      <div className="input-group">
                        <DatePicker
                          value={fromDate}
                          onChange={(date) => setFromDate(date)}
                          disabledDate={isDateBlocked}
                          format="DD/MM/YYYY"
                          placeholder="DD/MM/YYYY"
                          className="form-control fs-4 py-0"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="toDate" className="form-label">
                        To Date
                      </label>
                      <div className="input-group">
                        <DatePicker
                          value={toDate}
                          onChange={(date) => setToDate(date)}
                          disabledDate={isDateBlocked}
                          format="DD/MM/YYYY"
                          placeholder="DD/MM/YYYY"
                          className="form-control fs-4 py-0"
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-5">
                      <button
                        type="submit"
                        className="btn btn-primary rounded-0 fs-3 px-5"
                      >
                        Hire Driver
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HireDriver;
