import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./UpdateCar.css";
import Loader from "./Loader";
import apiClient from "../utils/apiClient";

const UpdateCar = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    type: "",
    transmission: "",
    color: "",
    year: "",
    price: "",
    odometer: "",
    fuelType: "",
    file: null,
    serviceFile: null,
    imageUrl: "",
  });

  const brands = ["Toyota", "TATA", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Hyundai", "Nissan"];
  const types = ["Sedan", "SUV", "Hatchback", "Convertible", "Coupe"];
  const transmissions = ["Manual", "Automatic"];
  const colors = ["White", "Black", "Silver", "Gray", "Blue", "Red", "Yellow", "Orange", "Pink"];
  const fuelTypes = ["Petrol", "Diesel", "Electric"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2012 + 1 }, (_, i) => 2012 + i);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await apiClient.get(`/api/customer/cars/${id}`);
        setFormData({ ...response.data, file: null, serviceFile: null });
      } catch (error) {
        console.error("Error fetching car:", error);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      const carData = {
        brand: formData.brand,
        name: formData.name,
        type: formData.type,
        transmission: formData.transmission,
        color: formData.color,
        year: formData.year,
        price: formData.price,
        odometer: formData.odometer,
        fuelType: formData.fuelType,
        imageUrl: formData.file ? null : formData.imageUrl, 
      };

      form.append("car", JSON.stringify(carData));

      if (formData.file) {
        form.append("file", formData.file);
      }

      if (formData.serviceFile) {
        form.append("serviceFile", formData.serviceFile);
      }

      await apiClient.put(`/api/admin/cars/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Updated!", "Car details have been updated.", "success").then(() => 
        navigate("/dashboard")
      );
    } catch (error) {
      Swal.fire("Error!", "Failed to update car details.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container bg-white p-5 rounded shadow col-md-8 mb-5">
        <h2 className="text-center fw-bold mb-4">Update Car</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <img src={formData.imageUrl} alt="Car" className="img-fluid" width="80px" height="80px" />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="file" className="form-label">
              Upload Image:
            </label>
            <input
              type="file"
              id="file"
              name="file"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="brand" className="form-label">
              Brand
            </label>
            <select
              id="brand"
              name="brand"
              className="form-select"
              value={formData.brand}
              onChange={handleChange}
              required
            >
              <option value="">Select a Brand Name</option>
              {brands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Type
            </label>
            <select
              id="type"
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select a Type</option>
              {types.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="transmission" className="form-label">
              Transmission
            </label>
            <select
              id="transmission"
              name="transmission"
              className="form-select"
              value={formData.transmission}
              onChange={handleChange}
              required
            >
              <option value="">Select Transmission</option>
              {transmissions.map((transmission, index) => (
                <option key={index} value={transmission}>
                  {transmission}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="color" className="form-label">
              Color
            </label>
            <select
              id="color"
              name="color"
              className="form-select"
              value={formData.color}
              onChange={handleChange}
              required
            >
              <option value="">Select a Color</option>
              {colors.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="year" className="form-label">
              Model Year
            </label>
            <select
              id="year"
              name="year"
              className="form-select"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="">Select a Year</option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="odometer" className="form-label">
              Odometer
            </label>
            <input
              type="number"
              className="form-control"
              id="odometer"
              name="odometer"
              value={formData.odometer}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fuelType" className="form-label">
              Fuel Type
            </label>
            <select
              id="fuelType"
              name="fuelType"
              className="form-select"
              value={formData.fuelType}
              onChange={handleChange}
              required
            >
              <option value="">Select Fuel Type</option>
              {fuelTypes.map((fuel, index) => (
                <option key={index} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-4">
            <label htmlFor="serviceFile" className="form-label">
              Upload Service Invoice:
            </label>
            <input
              type="file"
              id="serviceFile"
              name="serviceFile"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="register-button">
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateCar;
