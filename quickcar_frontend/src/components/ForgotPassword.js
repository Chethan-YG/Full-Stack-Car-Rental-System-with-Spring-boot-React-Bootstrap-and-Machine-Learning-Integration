import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "./Loader";
import { API_BASE_URL } from "./Config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 2000);
  
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
  };

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to send password reset email");
      }

      setMessage("Password reset email sent. Please check your inbox.");
      setError("");
      setShowOtpForm(true);
    } catch (error) {
      setError(error.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpString = otp.join("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify OTP");
      }

      setMessage("OTP verified successfully.");
      setError("");
      navigate("/reset-password");
    } catch (error) {
      setError(error.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to resend OTP");
      }

      setMessage("OTP has been resent. Please check your inbox.");
      setError("");
    } catch (error) {
      setError(error.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container bg-white p-5 rounded col-md-6">
        <div className="row justify-content-center">
          <h1 className="text-center fw-bold mb-4">Forgot Password</h1>
          <div className="form-group mb-4 fs-3">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                className="form-control py-2 fs-4"
                placeholder="Enter your email address"
                value={email}
                onChange={handleChange}
                required
                disabled={showOtpForm}
              />
            </div>
          </div>
          {!showOtpForm ? (
            <form onSubmit={handleEmailSubmit}>
              <div className="d-flex justify-content-center mb-4">
                <button type="submit" className="register-button">
                  Submit
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleOtpSubmit}>
                <div className="form-group mb-4 fs-3">
                  <label>OTP</label>
                  <div className="d-flex justify-content-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        className="form-control mx-1 text-center fs-4"
                        style={{ width: "50px" }}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
                <div className="d-flex justify-content-center mb-4">
                  <button type="submit" className="register-button">
                    Submit
                  </button>
                </div>
              </form>
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-link fs-4"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-center mt-2">
        {error && (
          <div className="alert alert-danger mt-2 text-center fs-5 fw-bold shadow border-0">
            {error}
          </div>
        )}
        {message && (
          <div className="alert alert-success mt-2 w-60 text-center fs-5 fw-bold shadow border-0">
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default ForgotPassword;
