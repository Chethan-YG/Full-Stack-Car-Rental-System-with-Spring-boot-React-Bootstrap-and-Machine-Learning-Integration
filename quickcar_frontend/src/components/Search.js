import React, { useState } from "react";
import "./Search.css";
import apiClient from "../utils/apiClient";

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    brand: "",
    type: "",
    transmission: "",
    color: "",
  });
  const [cars, setCars] = useState([]);


  
  const brands= [
    "Toyota", "TATA", "Honda", "Ford", "Chevrolet", "BMW",
    "Mercedes-Benz", "Audi", "Volkswagen", "Hyundai", "Nissan", "Mahindra"
  ];
  const types = ["Sedan", "SUV", "Hatchback", "Convertible", "Coupe"];
  const transmissions = ["Manual", "Automatic"];
  const colors = [
    "White", "Black", "Silver", "Gray", "Blue", "Red", "Yellow", "Orange", "Pink"
  ];
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleSearch = async () => {
    try {
      const response = await apiClient.post("/api/customer/cars/search", searchParams);
      setCars(response.data);
    } catch (error) {
      console.error("Error searching cars:", error);
    }
  };

  return (
    <div className="search-container">
      <h2 className="mb-4 fw-bold text-center">SEARCH CARS</h2>
      <div className="row d-flex justify-content-center">
        <div className="col-md-5 mb-3">
          <div className="form-group">
            <label htmlFor="brand">Brand:</label>
            <select
              id="brand"
              name="brand"
              className="form-select"
              value={searchParams.brand}
              onChange={handleChange}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-5 mb-3">
          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              className="form-select"
              value={searchParams.type}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-5 mb-3">
          <div className="form-group">
            <label htmlFor="transmission">Transmission:</label>
            <select
              id="transmission"
              name="transmission"
              className="form-select"
              value={searchParams.transmission}
              onChange={handleChange}
            >
              <option value="">Select Transmission</option>
              {transmissions.map((transmission) => (
                <option key={transmission} value={transmission}>
                  {transmission}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-5 mb-3">
          <div className="form-group">
            <label htmlFor="color">Color:</label>
            <select
              id="color"
              name="color"
              className="form-select"
              value={searchParams.color}
              onChange={handleChange}
            >
              <option value="">Select Color</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center mb-5">
        <button
          onClick={handleSearch}
          className="dash-button px-5 py-2 fw-bold"
        >
          SEARCH
        </button>
      </div>
      {cars.length > 0 ? (
        <div className="card-container">
          {cars.map((car, index) => (
            <div key={index} className="card mb-4 p-3 rounded-0">
              <div className="row g-0 mb-0">
                <div className="col-md-4 col-12">
                  <img
                    src={car.imageUrl}
                    className="img-fluid rounded-start"
                    alt={car.name}
                  />
                </div>
                <div className="col-md-8 col-12">
                  <div className="card-body py-0">
                    <h1 className="card-title fw-bold">
                      {car.brand} {car.name}
                    </h1>
                    <div className="row mb-0">
                      <div className="col-md-6 col-12 mb-3">
                        <p className="card-text">
                          <i className="bi bi-car-front"></i>{" "}
                          <strong>Type:</strong> {car.type}
                        </p>
                        <p className="card-text">
                          <i className="bi bi-gear"></i>{" "}
                          <strong>Transmission:</strong> {car.transmission}
                        </p>
                        <p className="card-text">
                          <i className="bi bi-palette"></i>{" "}
                          <strong>Color:</strong> {car.color}
                        </p>
                        <p className="card-text">
                          <i className="bi bi-speedometer"></i>{" "}
                          <strong>Odometer:</strong> {car.odometer} KM
                        </p>
                      </div>
                      <div className="col-md-6 col-12 mb-3">
                        <p className="card-text">
                          <i className="bi bi-calendar"></i>{" "}
                          <strong>Model:</strong> {car.year}
                        </p>
                        <p className="card-text">
                          <i className="bi bi-cash"></i> <strong>Price:</strong>{" "}
                          ${car.price}/day
                        </p>
                        <p className="card-text">
                          <i className="bi bi-fuel-pump"></i>{" "}
                          <strong>Fuel Type:</strong> {car.fuelType}
                        </p>
                        <p className="card-text">
                          <i className="bi bi-receipt me-2"></i>
                          <a
                            href={car.invoiceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <strong className="fs-4 ps-1">
                              OPEN SERVICE INVOICE
                            </strong>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-cars-message text-center">
          <p className="fw-bold h3">
            No cars found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
