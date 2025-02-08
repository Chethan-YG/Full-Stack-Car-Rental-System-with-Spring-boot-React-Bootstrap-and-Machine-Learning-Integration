import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Bookings from "./components/Bookings";
import Search from "./components/Search";
import ForgotPassword from "./components/ForgotPassword";
import Car from "./components/Car";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import UpdateCar from "./components/UpdateCar";
import BookCarDetails from "./components/BookCarDetails";
import Driver from "./components/Driver";
import UpdateDriver from "./components/UpdateDriver";
import HireDriver from "./components/HireDriver";
import Damage from "./components/Damage";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  const handleLogin = () => {
    const role = localStorage.getItem("userRole");
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username")
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
        <div className="content">
          <Routes>
            <Route path="/home" element={<ProtectedRoute element={<Home />} isAuthenticated={isAuthenticated} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} isAuthenticated={isAuthenticated} />} />
            <Route path="/book-car/:carId" element={<ProtectedRoute element={<BookCarDetails />} isAuthenticated={isAuthenticated} />} />
            <Route path="/car" element={<ProtectedRoute element={<Car />} isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="ADMIN" />} />
            <Route path="/bookings" element={<ProtectedRoute element={<Bookings />} isAuthenticated={isAuthenticated} />} />
            <Route path="/drive" element={<ProtectedRoute element={<Driver />} isAuthenticated={isAuthenticated} />} />
            <Route path="/search" element={<ProtectedRoute element={<Search />} isAuthenticated={isAuthenticated} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/damage" element={<ProtectedRoute element={<Damage />} isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="ADMIN" />} />
            <Route path="/update-car/:id" element={<ProtectedRoute element={<UpdateCar />} isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="ADMIN" />} />
            <Route path="/update-driver/:id" element={<ProtectedRoute element={<UpdateDriver />} isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="ADMIN" />} />
            <Route path="/driver-hire/:driverId" element={<ProtectedRoute element={<HireDriver />} isAuthenticated={isAuthenticated} />} />
          </Routes>
        </div>
        {isAuthenticated && <Footer className="footer" isAuthenticated={isAuthenticated} userRole={userRole} />}
      </div>
    </Router>
  );
}

export default App;
