import React, { useState } from "react";
import "./Car.css";
import Swal from "sweetalert2";
import Loader from "./Loader";
import apiClient from "../utils/apiClient";

const Car = () => {
  const [loading, setLoading] = useState(false);
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
  });

  const BRANDS = [
    "Toyota",
    "TATA",
    "Honda",
    "Ford",
    "Chevrolet",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Hyundai",
    "Nissan",
    "Mahindra",
  ];
  const TYPES = ["Sedan", "SUV", "Hatchback", "Convertible", "Coupe"];
  const TRANSMISSIONS = ["Manual", "Automatic"];
  const COLORS = [
    "White",
    "Black",
    "Silver",
    "Gray",
    "Blue",
    "Red",
    "Yellow",
    "Orange",
    "Pink",
  ];
  const FUEL_TYPES = ["Petrol", "Diesel", "Electric"];

  const currentYear = new Date().getFullYear();
  const YEARS = Array.from(
    { length: currentYear - 2012 + 1 },
    (_, i) => 2012 + i
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("car", JSON.stringify(formData));

    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    if (formData.serviceFile) {
      formDataToSend.append("serviceFile", formData.serviceFile);
    }

    try {
      await apiClient.post("/api/admin/cars", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }, 
      });

      Swal.fire({
        title: "Success!",
        text: "The car has been successfully added.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setFormData({
        brand: "",
        name: "",
        type: "",
        transmission: "",
        color: "",
        year: "",
        price: "",
        odometer: "",
        fuelType: "",
        file: "",
        serviceFile: "",
      });
    } catch (error) {
      console.error("Error uploading car data:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue uploading the car data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container bg-white p-5 rounded shadow col-md-8 mb-5">
        <h2 className="text-center fw-bold mb-4">POST CAR</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 d-flex justify-content-center">
            {formData.file && (
              <img
                src={URL.createObjectURL(formData.file)}
                alt="Car Preview"
                className="rounded-circle"
                width="120"
                height="110"
              />
            )}
          </div>

          <FileInput
            label="Upload Image:"
            id="file"
            name="file"
            onChange={handleFileChange}
          />

          <SelectInput
            label="Select a Brand Name:"
            id="brand"
            name="brand"
            value={formData.brand}
            options={BRANDS}
            onChange={handleChange}
          />

          <TextInput
            label="Name:"
            id="name"
            name="name"
            placeholder="Car Name"
            value={formData.name}
            onChange={handleChange}
          />

          <SelectInput
            label="Type:"
            id="type"
            name="type"
            value={formData.type}
            options={TYPES}
            onChange={handleChange}
          />

          <SelectInput
            label="Transmission:"
            id="transmission"
            name="transmission"
            value={formData.transmission}
            options={TRANSMISSIONS}
            onChange={handleChange}
          />

          <SelectInput
            label="Color:"
            id="color"
            name="color"
            value={formData.color}
            options={COLORS}
            onChange={handleChange}
          />

          <SelectInput
            label="Model Year:"
            id="year"
            name="year"
            value={formData.year}
            options={YEARS}
            onChange={handleChange}
          />

          <TextInput
            label="Price:"
            id="price"
            name="price"
            placeholder="Price"
            value={formData.price}
            type="number"
            onChange={handleChange}
          />

          <TextInput
            label="Odometer:"
            id="odometer"
            name="odometer"
            placeholder="Odometer"
            value={formData.odometer}
            type="number"
            onChange={handleChange}
          />

          <SelectInput
            label="Fuel Type:"
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            options={FUEL_TYPES}
            onChange={handleChange}
          />

          <FileInput
            label="Upload Service Invoice:"
            id="serviceFile"
            name="serviceFile"
            onChange={handleFileChange}
          />

          <div className="d-flex justify-content-center">
            <button type="submit" className="register-button">
              POST CAR
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const TextInput = ({
  label,
  id,
  name,
  placeholder,
  value,
  type = "text",
  onChange,
}) => (
  <div className="form-group mb-4">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

const SelectInput = ({ label, id, name, value, options, onChange }) => (
  <div className="form-group mb-4">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <select
      id={id}
      name={name}
      className="form-select"
      value={value}
      onChange={onChange}
      required
    >
      <option value="">Select an Option</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const FileInput = ({ label, id, name, onChange }) => (
  <div className="form-group mb-4">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <input
      type="file"
      id={id}
      name={name}
      className="form-control"
      onChange={onChange}
      required
    />
  </div>
);

export default Car;
