import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Loader from "./Loader";
import "./Bookings.css";
import DriverPaymentModal from "./DriverPaymentModal";
import apiClient from "../utils/apiClient";

export default function HiringCard() {
    const [driverDetails, setDriverDetails] = useState({});
    const [hirings, setHirings] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [userRole, setUserRole] = useState("CUSTOMER");
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole")
  
    useEffect(() => {
      setUserRole(role);

      const hiringUrl = role === "ADMIN" 
          ? `/api/admin/hirings`
          : `/api/customer/hirings/${userId}`;

      apiClient.get(hiringUrl)
          .then(({ data }) => {
              data.forEach((hiring) => {
                  fetchDriverDetails(hiring.driverId);
                  if (role === "ADMIN") {
                      fetchUserDetails(hiring.userId);
                  }
              });
              setHirings(data);
          })
          .catch((error) => console.error("Error fetching hirings:", error));
  }, [userId, userRole, role]);
    
  const fetchDriverDetails = (driverId) => {
    apiClient.get(`/api/customer/driver/${driverId}`)
        .then(({ data }) => {
            setDriverDetails((prevDetails) => ({
                ...prevDetails,
                [driverId]: data,
            }));
        })
        .catch((error) => console.error("Error fetching driver details:", error));
};

const fetchUserDetails = (userId) => {
    apiClient.get(`/api/customer/user/${userId}`)
        .then(({ data }) => {
            setUserDetails((prevDetails) => ({
                ...prevDetails,
                [userId]: data,
            }));
        })
        .catch((error) => console.error("Error fetching user details:", error));
};
    
  
    const handleApproveHiring = (hiringId) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to approve this hiring?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, approve it!",
        cancelButtonText: "No, cancel!",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          updateHiringStatus(hiringId, "APPROVED").finally(() => {
            setLoading(false);
          });
        }
      });
    };
  
    const handleRejectHiring = (hiringId) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to reject this hiring?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reject it!",
        cancelButtonText: "No, cancel!",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          updateHiringStatus(hiringId, "REJECTED").finally(() => {
            setLoading(false);
          });
        }
      });
    };
  
    const handleCancelHiring = (hiringId) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to cancel this hiring?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it!",
        cancelButtonText: "No, keep it!",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          cancelHiring(hiringId).finally(() => {
            setLoading(false);
          });
        }
      });
    };
  
    const cancelHiring = (hiringId) => {
      return apiClient.put(`/api/customer/hirings/${hiringId}/status`, null, {
          params: { status: "CANCELLED" },
      })
      .then(({ data }) => {
          setHirings((prevHirings) =>
              prevHirings.map((hiring) =>
                  hiring.id === hiringId ? data : hiring
              )
          );
      })
      .catch((error) => {
          console.error("Error canceling hiring:", error);
      });
  };
  
  const updateHiringStatus = (hiringId, status) => {
      const url = role === "ADMIN" 
          ? `/api/admin/hirings/${hiringId}/status` 
          : `/api/customer/hirings/${hiringId}/status`;
  
      return apiClient.put(url, null, {
          params: { status },
      })
      .then(({ data }) => {
          setHirings((prevHirings) =>
              prevHirings.map((hiring) =>
                  hiring.id === hiringId ? data : hiring
              )
          );
      })
      .catch((error) => {
          console.error("Error updating hiring status:", error);
      });
  };
  
    const [showModal, setShowModal] = useState(false);
    const [selectedHiringId, setSelectedHiringId] = useState(null);
  
    const handlePayClick = (hiringId) => {
      setSelectedHiringId(hiringId);
      setShowModal(true);
    };
  
    const handleModalClose = () => setShowModal(false);
  
    const handleModalSubmit = (amount) => {
      if (selectedHiringId && amount) {
        handleDriverPay(selectedHiringId, amount);
      }
    };
  
    const handleDriverPay = async (hiringId, hiringWage) => {
      try {
        const { data } = await apiClient.post("/api/customer/create_order", {
            amount: hiringWage,
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
              contact: "+919900000000",
            },
            theme: {
              color: "#d4002a",
            },
            handler: function (response) {
              setLoading(true);
              updateHiringStatus(hiringId, "SETTELED")
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
    <div>
      <div className="book-container">
        {loading && <Loader />}
        <h1 className="fw-bold text-center mb-3">HIRINGS</h1>
        {hirings.length === 0 ? (
          <h2 className="fw-bold text-center">No hirings found.</h2>
        ) : (
          <div className="d-flex flex-column align-items-center">
            {hirings.map((hiring) => (
              <div key={hiring.id} className="custom-card-container mb-4">
                <div className="col-md-9">
                  <div className="card rounded-0 p-3 pb-0 shadow">
                    <div className="row g-0 d-flex justify-content-center">
                      <div className="col-md-3 col-sm-6 col-6">
                        {driverDetails[hiring.driverId] && (
                          <img
                            src={driverDetails[hiring.driverId].profilePicUrl}
                            className="img-fluid rounded-start"
                            alt={driverDetails[hiring.driverId].name}
                          />
                        )}
                      </div>
                      <div className="col-md-9 col-12">
                        <div className="card-body py-0">
                          {driverDetails[hiring.driverId] && (
                            <h5 className="card-title fw-bold  card-title-sm-center">
                              {driverDetails[hiring.driverId].name}
                            </h5>
                          )}
                          <div className="row">
                            <div className="">
                              {driverDetails[hiring.driverId] && (
                                <div className="car-details">
                                  <div className="row mb-0">
                                    <div className="col-md-6">
                                      <p className="card-text">
                                        <i className="bi bi-calendar3-event"></i>{" "}
                                        <strong>From: </strong>{" "}
                                        {new Date(
                                          hiring.fromDate
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}
                                      </p>

                                      <p className="card-text">
                                        <i className="bi bi-telephone"></i>{" "}
                                        <strong>Contact: </strong>
                                        {driverDetails[hiring.driverId].phNo}
                                      </p>
                                      <p className="card-text">
                                        <i className="bi bi-alarm"></i>{" "}
                                        <strong>Days: </strong>
                                        {hiring.days}
                                      </p>
                                      {userRole === "ADMIN" &&
                                        userDetails[hiring.userId] && (
                                          <div className="user-details">
                                            <p className="card-text">
                                              <i className="bi bi-person"></i>{" "}
                                              <strong>Username:</strong>{" "}
                                              {userDetails[hiring.userId].name}
                                            </p>
                                          </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                      <p className="card-text">
                                        <i className="bi bi-calendar3-event"></i>{" "}
                                        <strong>To: </strong>{" "}
                                        {new Date(
                                          hiring.toDate
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}
                                      </p>

                                      <p className="card-text">
                                        <i className="bi bi-gear"></i>{" "}
                                        <strong>Expertise: </strong>
                                        {
                                          driverDetails[hiring.driverId]
                                            .expertise
                                        }
                                      </p>

                                      <p
                                        className={`card-text ${getStatusColor(
                                          hiring.hireStatus
                                        )}`}
                                      >
                                        <i className="bi bi-hourglass-split"></i>{" "}
                                        <strong>Status: </strong>
                                        {hiring.hireStatus}
                                      </p>
                                      {userRole === "ADMIN" &&
                                        userDetails[hiring.userId] && (
                                          <div className="user-details">
                                            <p className="card-text">
                                              <i className="bi bi-envelope"></i>{" "}
                                              <strong>Email:</strong>{" "}
                                              <span className="fs-5">
                                                {
                                                  userDetails[hiring.userId]
                                                    .email
                                                }
                                              </span>
                                            </p>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="d-flex justify-content-end align-items-center mt-3">
                            {userRole === "ADMIN" &&
                              hiring.hireStatus === "PENDING" && (
                                <>
                                  <button
                                    className="btn btn-success me-2 rounded-0 fs-3 px-5"
                                    onClick={() =>
                                      handleApproveHiring(hiring.id)
                                    }
                                  >
                                    APPROVE
                                  </button>
                                  <button
                                    className="btn btn-danger rounded-0 fs-3 px-5"
                                    onClick={() =>
                                      handleRejectHiring(hiring.id)
                                    }
                                  >
                                    REJECT
                                  </button>
                                </>
                              )}
                            {userRole === "CUSTOMER" &&
                              hiring.hireStatus === "PENDING" && (
                                <button
                                  className="btn btn-danger rounded-0 fs-3 px-5 mt-5"
                                  onClick={() => handleCancelHiring(hiring.id)}
                                >
                                  CANCEL
                                </button>
                              )}
                            {userRole === "CUSTOMER" &&
                              hiring.hireStatus === "APPROVED" && (
                                <div className="booking-actions d-flex justify-content-end mt-1">
                                  <button
                                    className="btn btn-primary rounded-0 fs-3 px-5"
                                    onClick={() => handlePayClick(hiring.id)}
                                  >
                                    PAY
                                  </button>
                                </div>
                              )}

                            <DriverPaymentModal
                              show={showModal}
                              handleClose={handleModalClose}
                              handleSubmit={handleModalSubmit}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
