import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Loader from "./Loader";
import apiClient from "../utils/apiClient"; 
import "./Bookings.css";

export default function BookingCard() {
  const [bookings, setBookings] = useState([]);
  const [carDetails, setCarDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [userRole, setUserRole] = useState("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role= localStorage.getItem("userRole")


  useEffect(() => {
    const role = localStorage.getItem("userRole") || "CUSTOMER";
    setUserRole(role);
  
    const bookingsUrl =
      role === "ADMIN"
        ? `/api/admin/bookings`
        : `/api/customer/bookings/${userId}`;
  
    apiClient
      .get(bookingsUrl)
      .then((response) => {
        const data= response.data
        data.forEach((booking) => {
          fetchCarDetails(booking.carId);
          if (role === "ADMIN") {
            fetchUserDetails(booking.userId);
          }
        });
        setBookings(data);
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [userId, userRole, token]);
  
  const fetchCarDetails = (carId) => {
    const carDetailsUrl = `/api/customer/cars/${carId}`;
  
    apiClient
      .get(carDetailsUrl)
      .then((response) => {
        const data =response.data
        setCarDetails((prevDetails) => ({
          ...prevDetails,
          [carId]: data,
        }));
      })
      .catch((error) => console.error("Error fetching car details:", error));
  };
  
  const fetchUserDetails = (userId) => {
    const userDetailsUrl = `/api/customer/user/${userId}`;
  
    apiClient
      .get(userDetailsUrl)
      .then((data) => {
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          [userId]: data,
        }));
      })
      .catch((error) => console.error("Error fetching user details:", error));
  };
  

  const handleApproveBooking = (bookingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        updateBookingStatus(bookingId, "APPROVED").finally(() => {
          setLoading(false);
        });
      }
    });
  };

  const handleRejectBooking = (bookingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        updateBookingStatus(bookingId, "REJECTED").finally(() => {
          setLoading(false);
        });
      }
    });
  };

  const handleCancelBooking = (bookingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        cancelBooking(bookingId).finally(() => {
          setLoading(false);
        });
      }
    });
  };

const cancelBooking = (bookingId) => {
  const url = `/api/customer/bookings/${bookingId}/status?status=CANCELLED`;

  apiClient
    .put(url)
    .then((updatedBooking) => {
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? updatedBooking : booking
        )
      );
    })
    .catch((error) => {
      console.error("Error updating booking status:", error);
    });
};

const updateBookingStatus = (bookingId, status) => {
  const url =
    role === "ADMIN"
      ? `/api/admin/bookings/${bookingId}/status?status=${status}`
      : `/api/customer/bookings/${bookingId}/status?status=${status}`;

  apiClient
    .put(url)
    .then((updatedBooking) => {
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? updatedBooking : booking
        )
      );
    })
    .catch((error) => {
      console.error("Error updating booking status:", error);
    });
};


  const handlePay = async (bookingId, bookingPrice) => {
    try {
      const { data } = await apiClient.post("/api/customer/create_order", {
          amount: bookingPrice,
          info: "order_request",
      });


      if (data.status === "created") {
        let options = {
          key: "rzp_test_fj0W1Ebf3STz4r",
          amount: data.amount,
          currency: "INR",
          description: "Quick Car payment",
          image: "https://i.postimg.cc/63Q6W6xP/Quick-Carnew.png",
          order_id: data.id,
          prefill: {
            email: "quickar.payment@example.com",
            contact: "+91 7411123855",
          },
          theme: {
            color: "#d4002a",
            width: "300px",
            height: "300px",
          },
          handler: function (response) {
            setLoading(true);
            updateBookingStatus(bookingId, "CONFIRMED")
              .then(() => {
                console.log(
                  `Payment Successful! Payment ID: ${response.razorpay_payment_id}`
                );
              })
              .catch((error) => {
                console.error("Error updating booking status:", error);
              })
              .finally(() => {
                setLoading(false);
              });
          },
        };

        var rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          console.log("Payment Failed:", response.error);
          alert("Payment failed. Please try again.");
        });
        rzp1.open();
      } else {
        console.error("Invalid response status:", data.status);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("Something went wrong");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-warning";
      case "APPROVED":
        return "text-info";
      case "REJECTED":
        return "text-danger";
      case "CANCELLED":
        return "text-muted";
      case "CONFIRMED":
        return "text-success";
      case "SETTELED":
        return "text-success";
      default:
        return "text-secondary";
    }
  };

  return (
    <>
      {loading && Loader}
      <div className="booked-container">
        <h1 className="fw-bold text-center mb-3">BOOKINGS</h1>
        {bookings.length === 0 ? (
          <h2 className="fw-bold text-center">No bookings found.</h2>
        ) : (
          <div className="row">
            {bookings.map((booking) => (
              <div key={booking.id} className="col-md-12 mb-4">
                <div className="card shadow">
                  <div className="row g-0 mb-0">
                    <div className="col-md-4 col-sm-10 col-12 text-center">
                      {carDetails[booking.carId] && (
                        <img
                          src={carDetails[booking.carId].imageUrl}
                          className="img-fluid rounded-start"
                          alt={carDetails[booking.carId].name}
                        />
                      )}
                    </div>
                    <div className="col-md-8 col-12">
                      <div className="card-body py-0">
                        {carDetails[booking.carId] && (
                          <div className="car-details">
                            <h5 className="card-title fw-bold">
                              {carDetails[booking.carId].brand}{" "}
                              {carDetails[booking.carId].name}
                            </h5>
                            <div className="row mb-0">
                              <div className="col-md-6 col-12 mb-3">
                                <p className="card-text">
                                  <i className="bi bi-car-front"></i>{" "}
                                  <strong>Type:</strong>{" "}
                                  {carDetails[booking.carId].type}
                                </p>
                                {userRole === "CUSTOMER" && (
                                  <p className="card-text">
                                    <i className="bi bi-gear"></i>{" "}
                                    <strong>Transmission:</strong>{" "}
                                    {carDetails[booking.carId].transmission}
                                  </p>
                                )}
                                {userRole === "ADMIN" && (
                                  <p className="card-text">
                                    <i className="bi bi-file-earmark-break"></i>{" "}
                                    <strong>Licence:</strong>{" "}
                                    <a
                                      href={booking.licenseImage}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="fw-bold"
                                    >
                                      VIEW LICENCE
                                    </a>
                                  </p>
                                )}
                                <p className="card-text">
                                  <i className="bi bi-calendar3-event"></i>{" "}
                                  <strong>From: </strong>{" "}
                                  {new Date(
                                    booking.fromDate
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })}
                                </p>
                                <p className="card-text">
                                  <i className="bi bi-alarm"></i>{" "}
                                  <strong>Days: </strong> {booking.days}
                                </p>

                                {userRole === "ADMIN" &&
                                  userDetails[booking.userId] && (
                                    <div className="user-details">
                                      <p className="card-text">
                                        <i className="bi bi-person"></i>{" "}
                                        <strong>Username:</strong>{" "}
                                        {userDetails[booking.userId].name}
                                      </p>
                                    </div>
                                  )}
                              </div>
                              <div className="col-md-6 col-12 mb-3">
                                <p className="card-text">
                                  <i className="bi bi-calendar"></i>{" "}
                                  <strong>Model Year:</strong>{" "}
                                  {carDetails[booking.carId].year}
                                </p>
                                <p className="card-text">
                                  <i className="bi bi-cash"></i>{" "}
                                  <strong>Total Price:</strong>₹{booking.price}
                                </p>
                                <p className="card-text">
                                  <i className="bi bi-calendar-event"></i>{" "}
                                  <strong>To: </strong>{" "}
                                  {new Date(booking.toDate).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                                <p
                                  className={`card-text ${getStatusColor(
                                    booking.bookCarStatus
                                  )}`}
                                >
                                  <i className="bi bi-hourglass-split"></i>{" "}
                                  <strong>Status: </strong>{" "}
                                  {booking.bookCarStatus}
                                </p>
                                {userRole === "ADMIN" &&
                                  userDetails[booking.userId] && (
                                    <div className="user-details">
                                      <p className="card-text">
                                        <i className="bi bi-envelope"></i>{" "}
                                        <strong>Email:</strong>{" "}
                                        <span className="fs-5">
                                          {userDetails[booking.userId].email}
                                        </span>
                                      </p>
                                    </div>
                                  )}
                              </div>
                            </div>
                            <div className="d-flex justify-content-end">
                              {userRole === "ADMIN" &&
                                booking.bookCarStatus === "PENDING" && (
                                  <div className="booking-actions d-flex justify-content-end mt-1">
                                    <button
                                      className="btn btn-success me-2 rounded-0 fs-3 px-5"
                                      onClick={() =>
                                        handleApproveBooking(booking.id)
                                      }
                                    >
                                      APPROVE
                                    </button>
                                    <button
                                      className="btn btn-danger rounded-0 fs-3 px-5"
                                      onClick={() =>
                                        handleRejectBooking(booking.id)
                                      }
                                    >
                                      REJECT
                                    </button>
                                  </div>
                                )}
                              {userRole === "CUSTOMER" &&
                                booking.bookCarStatus === "PENDING" && (
                                  <div className="booking-actions d-flex justify-content-end mt-1">
                                    <button
                                      className="btn btn-danger rounded-0 fs-3 px-5"
                                      onClick={() =>
                                        handleCancelBooking(booking.id)
                                      }
                                    >
                                      CANCEL
                                    </button>
                                  </div>
                                )}
                              {userRole === "CUSTOMER" &&
                                booking.bookCarStatus === "APPROVED" && (
                                  <div className="booking-actions d-flex justify-content-end mt-1">
                                    <button
                                      className="btn btn-primary rounded-0 fs-3 px-5"
                                      onClick={() =>
                                        handlePay(booking.id, booking.price)
                                      }
                                    >
                                      PAY
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
