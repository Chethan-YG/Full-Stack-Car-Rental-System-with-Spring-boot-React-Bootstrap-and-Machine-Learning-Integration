import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "./Loader";
import apiClient from "../utils/apiClient";

const UpdateDriver = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    expertise: "",
    languages: "",
    licence: "",
    name: "",
    phNo: "",
    yoe: "",
    age: "",
    file: null,
    profilePicUrl: "",
  });

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await apiClient.get(`/api/admin/drivers/${id}`);
        setFormData({ ...response.data, file: null });
      } catch (error) {
        console.error("Error fetching driver:", error);
      }
    };

    fetchDriverDetails();
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
      const driverData = {
        expertise: formData.expertise,
        languages: formData.languages,
        licence: formData.licence,
        name: formData.name,
        age: formData.age,
        phNo: formData.phNo,
        yoe: formData.yoe,
        profilePicUrl: formData.file ? null : formData.profilePicUrl,
      };

      form.append("driver", JSON.stringify(driverData));

      if (formData.file) {
        form.append("file", formData.file);
      }

      await apiClient.put(`/api/admin/drivers/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Updated!", "Driver details have been updated.", "success").then(() => 
        navigate("/drive")
      );
    } catch (error) {
      Swal.fire("Error!", "Failed to update driver details.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container bg-white p-5 rounded shadow col-md-8 mb-5">
        <h2 className="text-center fw-bold mb-4">Update Driver</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 d-flex justify-content-center">
            <img src={formData.profilePicUrl} alt="Driver" className="rounded-circle" width="110px" height="100px" />
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
            <label htmlFor="age" className="form-label">
              Age
            </label>
            <input
              type="number"
              className="form-control"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="expertise" className="form-label">
              Expertise:
            </label>
            <input
              type="text"
              className="form-control"
              id="expertise"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="languages" className="form-label">
              Languages (comma-separated)
            </label>
            <input
              type="text"
              className="form-control"
              id="languages"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="licenseNumber" className="form-label">
              Driver's License Number
            </label>
            <input
              type="text"
              className="form-control"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licence}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="experience" className="form-label">
              Years of Experience
            </label>
            <input
              type="number"
              className="form-control"
              id="experience"
              name="yoe"
              value={formData.yoe}
              onChange={handleChange}
              required
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

export default UpdateDriver;
