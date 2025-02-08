import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Signup.css";
import { API_BASE_URL } from "./Config.js";

const SignUp = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    checkPassword: "",
    name: "",
  });

  const navigate = useNavigate();

  const validateMessages = {
    required: "This field is required!",
    email: "The input is not valid E-mail!",
    passwordPattern:
      "Password must contain 1 lowercase, 1 uppercase, 1 number, 1 special character.",
    confirmPassword: "Password does not match!",
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = validateMessages.required;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = validateMessages.email;
    }

    if (!values.password) {
      errors.password = validateMessages.required;
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(values.password)
    ) {
      errors.password = validateMessages.passwordPattern;
    }

    if (!values.checkPassword) {
      errors.checkPassword = validateMessages.required;
    } else if (values.checkPassword !== values.password) {
      errors.checkPassword = validateMessages.confirmPassword;
    }

    if (!values.name) {
      errors.name = validateMessages.required;
    }

    return errors;
  };

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onFinish = async (event) => {
    event.preventDefault();
    const formErrors = validateForm(formValues);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSpinning(true);

    try {
      const response = await fetch(`${ API_BASE_URL }/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
          name: formValues.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);

      
      Swal.fire({
        title: 'Success!',
        text: 'You have successfully signed up.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSpinning(false);
    }
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  return (
    <div className="container bg-white p-5 rounded justify-content-center col-md-8 col-lg-10">
      {!isSpinning && (
        <form onSubmit={onFinish}>
          <div className="mb-4">
            <h1 className="text-center fw-bold">SIGN UP</h1>
          </div>
          <div className="form-group mb-4 fs-3">
            <label htmlFor="name">NAME</label>
            <div className="input-group">
              <input
                type="text"
                className={`form-control py-1 fs-4 ${
                  errors.name ? "is-invalid" : ""
                }`}
                id="name"
                placeholder="Enter your Name"
                value={formValues.name}
                onChange={handleInputChange}
                required
              />
              <span className="input-group-text bg-white">
                <i className="bi bi-person fs-4"></i>
              </span>
            </div>
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="form-group mb-4 fs-3">
            <label htmlFor="email">EMAIL</label>
            <div className="input-group">
              <input
                type="email"
                className={`form-control py-1 fs-4 ${
                  errors.email ? "is-invalid" : ""
                }`}
                id="email"
                placeholder="Enter your email"
                value={formValues.email}
                onChange={handleInputChange}
                required
              />
              <span className="input-group-text bg-white">
                <i className="bi bi-envelope fs-4"></i>
              </span>
            </div>
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="form-group mb-4 fs-3">
            <label htmlFor="password">PASSWORD</label>
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                className={`form-control py-1 fs-4 pass ${
                  errors.password ? "is-invalid" : ""
                }`}
                id="password"
                placeholder="Enter your Password"
                value={formValues.password}
                onChange={handleInputChange}
                minLength={8}
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
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <div className="form-group mb-4 fs-3">
            <label htmlFor="checkPassword">CONFIRM PASSWORD</label>
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                className={`form-control py-1 fs-4 pass${
                  errors.checkPassword ? "is-invalid" : ""
                }`}
                id="checkPassword"
                placeholder="Confirm Password"
                value={formValues.checkPassword}
                onChange={handleInputChange}
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
            {errors.checkPassword && (
              <div className="invalid-feedback">{errors.checkPassword}</div>
            )}
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="register-button">
              Register
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignUp;
