import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../utils/apiClient";
import "./Driver.css";
import Loader from "./Loader";

const Driver = () => {
  const [drivers, setDrivers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [formData, setFormData] = useState({
    expertise: "",
    languages: "",
    licence: "",
    name: "",
    phNo: "",
    yoe: "",
    age: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole") || "");

    apiClient
      .get("/api/customer/drivers")
      .then(({ data }) => setDrivers(data))
      .catch((error) => console.error("Error fetching drivers:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleAddDriver = (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();

      const driverData = JSON.stringify({
      expertise: formData.expertise,
      languages: formData.languages,
      licence: formData.licence,
      name: formData.name,
      age: formData.age,
      phNo: formData.phNo,
      yoe: formData.yoe,
    });

    form.append("driver", driverData);
    if (formData.file) {
      form.append("file", formData.file); 
    }

    apiClient
      .post("/api/admin/drivers", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        Swal.fire("Added!", "Driver has been added successfully.", "success")
          .then(() => {
            setFormData({
              expertise: "",
              languages: "",
              licence: "",
              name: "",
              phNo: "",
              yoe: "",
              age: "",
              file: null,
            });

            document.getElementById("file").value = "";

            return apiClient.get("/api/customer/drivers");
          })
          .then(({ data }) => setDrivers(data))
          .catch((error) => console.error("Error fetching drivers:", error));
      })
      .catch((error) => {
        console.error("Error adding driver:", error);
        Swal.fire("Error!", "Failed to add driver.", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleUpdate = (id) => {
    navigate(`/update-driver/${id}`);
  };

  const handleDelete = (driverId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .delete(`/api/admin/drivers/${driverId}`)
          .then(() => {
            setDrivers(drivers.filter((driver) => driver.id !== driverId));
            Swal.fire("Deleted!", "Your driver has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting driver:", error);
            Swal.fire(
              "Error!",
              "There was an error deleting the driver.",
              "error"
            );
          });
      }
    });
  };

  const handleHire = (driverId) => {
    navigate(`/driver-hire/${driverId}`);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="Driver-container">
        <div className="row Drivers-container">
          <h2 className="text-center fw-bold mb-4">AVAILABLE DRIVERS</h2>
          {drivers.map((driver, index) => (
            <div key={index} className="col-md-6 mb-5">
              <div className="card p-3 h-100 rounded-0 shadow">
                <div className="row g-0 mb-0">
                  <div className="col-md-4 col-sm-6 col-8 driver-image-container">
                    <img
                      src={driver.profilePicUrl}
                      className="img-fluid rounded-start"
                      alt={driver.name}
                    />
                    <h2 className="fw-bold text-center name">{driver.name}</h2>
                  </div>
                  <div className="col-md-8 col-12">
                    <div className="card-body py-0">
                      <p className="card-text">
                        <i className="bi bi-gear"></i>{" "}
                        <strong>Expertise:</strong> {driver.expertise}
                      </p>
                      <p className="card-text">
                        <i className="bi bi-chat-left-text"></i>{" "}
                        <strong>Languages:</strong> {driver.languages}
                      </p>
                      <p className="card-text">
                        <i className="bi bi-card-text"></i>{" "}
                        <strong>Licence:</strong> {driver.licence}
                      </p>
                      <p className="card-text">
                        <i className="bi bi-telephone"></i>{" "}
                        <strong>Phone:</strong> {driver.phNo}
                      </p>
                      <p className="card-text">
                        <i className="bi bi-briefcase"></i>{" "}
                        <strong>Experience:</strong> {driver.yoe} yrs
                      </p>
                      <p className="card-text">
                        <i className="bi bi-calendar4"></i>{" "}
                        <strong>Age:</strong> {driver.age} yrs
                      </p>
                      <div className="d-flex justify-content-end">
                        {userRole === "ADMIN" ? (
                          <>
                            <button
                              className="btn btn-warning rounded-0 me-2 fs-3 px-5 mt-1"
                              onClick={() => handleUpdate(driver.id)}
                            >
                              UPDATE
                            </button>
                            <button
                              className="btn btn-danger rounded-0 fs-3 px-5 mt-1"
                              onClick={() => handleDelete(driver.id)}
                            >
                              DELETE
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-primary rounded-0 fs-3 px-5 mt-2"
                            onClick={() => handleHire(driver.id)}
                          >
                            HIRE
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {userRole === "ADMIN" && (
          <div className="container bg-white p-5 rounded shadow col-md-8 mb-5">
            <h2 className="text-center fw-bold mb-4">ADD DRIVER</h2>
            <form onSubmit={handleAddDriver}>
              <div className="mb-3 d-flex justify-content-center">
                {formData.file && (
                  <img
                    src={URL.createObjectURL(formData.file)}
                    alt="Driver"
                    className="rounded-circle"
                    width="110px"
                    height="100px"
                  />
                )}
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
                  Expertise
                </label>
                <select
                  id="expertise"
                  name="expertise"
                  className="form-control"
                  value={formData.expertise}
                  onChange={handleChange}
                >
                  <option value="">Select Expertise</option>
                  <option value="Highway">Highway</option>
                  <option value="Ghat Section">Night-drive</option>
                  <option value="Urban">Urban</option>
                  <option value="Off-road">Off-road</option>
                  <option value="Off-road">Steep Terrain</option>
                </select>
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
                <label htmlFor="licence" className="form-label">
                  Driver's License Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="licence"
                  name="licence"
                  value={formData.licence}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phNo" className="form-label">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phNo"
                  name="phNo"
                  value={formData.phNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="yoe" className="form-label">
                  Years of Experience
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="yoe"
                  name="yoe"
                  value={formData.yoe}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="register-button">
                  ADD DRIVER
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Driver;
