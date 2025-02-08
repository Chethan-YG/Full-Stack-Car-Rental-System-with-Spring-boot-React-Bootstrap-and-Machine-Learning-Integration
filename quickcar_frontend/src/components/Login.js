import React, {useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Login.css";
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from "./Config";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
  
      const result = await response.json();
      const { token, refreshToken } = result;

    if(token)
    {
  
        const decodedToken = jwtDecode(token);
  
        const { role, name, email, userId } = decodedToken;
    
  
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userRole", role);
      localStorage.setItem("username", name);
      localStorage.setItem("email", email);
      localStorage.setItem("userId", userId);
  
      onLogin();
      setError(""); 
      navigate("/home");
    }
    } catch (error) {
      setError(error.message);
    }
  };
  

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const refreshToken = queryParams.get("refresh");

  
    if(token)
      {
    
          const decodedToken = jwtDecode(token);
    
          const { role, name, email, userId } = decodedToken;
      
    
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userRole", role);
        localStorage.setItem("username", name);
        localStorage.setItem("email", email);
        localStorage.setItem("userId", userId);
    
        onLogin(); 
        setError(""); 
        navigate("/home");
      }},[location, navigate, onLogin]
    );
  
 
  return (
    <>
      <div className="container bg-white p-5 rounded col-md-8">
        <div className="row justify-content-center mb-0">
          <h1 className="text-center fw-bold mb-4">LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4 fs-3">
              <label htmlFor="email">EMAIL</label>
              <div className="input-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control py-2 fs-4"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <span className="input-group-text bg-white border norm">
                  <i className="bi bi-person fs-4"></i>
                </span>
              </div>
            </div>

            <div className="form-group mb-2 fs-3">
              <label htmlFor="password">PASSWORD</label>
              <div className="input-group">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-control py-1 fs-4"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-group-text btn border"
                  onClick={handlePasswordToggle}
                >
                  <i
                    className={`bi ${
                      passwordVisible ? "bi-eye" : "bi-eye-slash"
                    } fs-4`}
                  ></i>
                </span>
              </div>
            </div>

            <div className="mb-2 text-end fs-4">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <div className="d-flex justify-content-center mb-4">
              <button type="submit" className="register-button">
                Submit
              </button>
            </div>
          </form>

          <div className="d-flex align-items-center mb-4">
            <div className="border-top flex-grow-1"></div>
            <span className="mx-3 fs-4">or</span>
            <div className="border-top flex-grow-1"></div>
          </div>

          <div className="d-flex flex-column align-items-center">
            <div>
              <div className="w-100 mb-3">
                <a href={`${API_BASE_URL}/oauth2/authorization/google`}>
                  <button className="btn btn-danger rounded-0 fs-4 py-2 fw-bold w-100">
                    <i className="bi bi-google me-2"></i>
                    CONTINUE WITH GOOGLE
                  </button>
                </a>
              </div>
              <div className="w-100">
                <a href={`${API_BASE_URL}/oauth2/authorization/facebook`}>
                  <button className="btn btn-primary rounded-0 fs-4 py-2 fw-bold w-100">
                    <i className="bi bi-facebook me-2"></i>
                    CONTINUE WITH FACEBOOK
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        {error && (
          <div className="alert alert-danger mt-3 text-center fs-4 fw-bold shadow border-0">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
