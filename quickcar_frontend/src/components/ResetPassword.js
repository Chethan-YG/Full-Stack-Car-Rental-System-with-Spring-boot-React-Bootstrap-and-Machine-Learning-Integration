import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "./Config";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch(`${ API_BASE_URL }/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: password }), 
      });
  
      const responseText = await response.text(); 
      console.log(responseText); 
      if (!response.ok) {
        throw new Error("Failed to reset password");
      }
  
      const responseData = JSON.parse(responseText); 
      console.log(responseData);
      setMessage(responseData.message || "Password reset successfully.");
      setError("");
      navigate("/")
    } catch (error) {
      setError(error.message);
      setMessage("");
    }
  };

  return (
    <div className="container bg-white p-5 rounded col-md-6">
      <div className="row justify-content-center">
        <h1 className="text-center fw-bold mb-4">Reset Password</h1>
        <form onSubmit={handleResetPassword}>
          <div className="form-group mb-4 fs-3">
            <label htmlFor="password">New Password</label>
            <div className="input-group">
              <input
                type="password"
                id="password"
                name="password"
                className="form-control py-2 fs-4"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group mb-4 fs-3">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control py-2 fs-4"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="d-flex justify-content-center mb-4">
            <button type="submit" className="register-button">
              Reset Password
            </button>
          </div>
          {message && (
            <div className="alert alert-success text-center fs-4 fw-bold">
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger mt-2 text-center fs-4 fw-bold shadow border-0">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
