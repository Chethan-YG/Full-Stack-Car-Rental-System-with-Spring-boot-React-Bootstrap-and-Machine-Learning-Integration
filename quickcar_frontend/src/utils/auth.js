// src/utils/authUtils.js

// Save the access token to localStorage
export const saveAuthToken = (token) => {
  localStorage.setItem("token", token);
};

// Retrieve the access token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Save the refresh token to localStorage
export const saveRefreshToken = (refreshToken) => {
  localStorage.setItem("refreshToken", refreshToken);
};

// Retrieve the refresh token from localStorage
export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

// Save user details (e.g., userId and role) to localStorage
export const saveUserDetails = (userId, role) => {
  localStorage.setItem("userId", userId);
  localStorage.setItem("userRole", role);
};

// Retrieve user details from localStorage
export const getUserDetails = () => {
  return {
    userId: localStorage.getItem("userId"),
    userRole: localStorage.getItem("userRole"),
  };
};

// Clear authentication data and navigate to the login page
export const clearAuthData = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  navigate("/login?loggedOut=true");
};
