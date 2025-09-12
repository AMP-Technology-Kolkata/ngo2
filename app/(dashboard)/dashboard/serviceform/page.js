"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";

function Page() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
  });
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState(null);

  // listshow
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/services/list`,
        { withCredentials: true }
      );
      setServices(response.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  // form SubmitEventmi
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "name" || name === "description" || name === "url") {
      newValue = value.trimStart();
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/services/update/${editId}`,
          formData,
          { withCredentials: true }
        );
        setEditId(null);
        swal("Success", "Service updated successfully!", "success");
        ``;
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/services/insert`,
          formData,
          { withCredentials: true }
        );
        swal("Success", "Service added successfully!", "success");
      }
      fetchServices();
      setFormData({ name: "", description: "", url: "" });
    } catch (error) {
      console.error("Error adding/updating service:", error);
    }
  };
  // delete
  const handleDelete = async (id) => {
    try {
      const shouldDelete = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this service!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (shouldDelete) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/services/delete/${id}`,
          { withCredentials: true }
        );
        swal("Success", "Service deleted successfully!", "success");
        fetchServices();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleEdit = (service) => {
    setFormData(service);
    setEditId(service._id);
    setShowForm(true);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({ name: "", description: "", url: "" });
    setEditId(null);
  };

  return (
    <div className="container mt-5">
      {showForm && (
        <div>
          <h2 style={{ color: "#007bff" }}>Add Services </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Service Name{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max length: 100 characters)
                </span>
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Description{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max length: 250 characters)
                </span>{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Add URL</label>
              <input
                type="url"
                className="form-control"
                name="url"
                value={formData.url}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary mr-2">
              {editId ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleForm}
            >
              Cancel
            </button>
          </form>
          <hr />
        </div>
      )}

      <div>
        <h2 style={{ color: "#007bff" }}>Services</h2>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Description</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {service.url}
                  </a>
                </td>
                <td>
                  <div className="d-flex align-self-center">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(service._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!showForm && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={toggleForm}
          >
            Add Service
          </button>
        )}
      </div>
    </div>
  );
}

export default Page;
