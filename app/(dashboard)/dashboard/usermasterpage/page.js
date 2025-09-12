"use client"
import React, { useState, useEffect } from "react";

function Page({ initialFormData }) {
  const [officeDetails, setOfficeDetails] = useState([
    {
      userId: 1234,
      password: "Password123",
      confirmPassword: "Password123",
      avatar: "office1_avatar.png",
    },
    {
      userId: 1234,
      password: "SecurePass321",
      confirmPassword: "SecurePass321",
      avatar: "office2_avatar.png",
    },
  ]);

  const [formData, setFormData] = useState(initialFormData || {});
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    setFormData(initialFormData || {});
  }, [initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOfficeDetails([...officeDetails, formData]);
    setFormData({
      userId: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    });
    // Hide the form after submission
    setShowForm(false);
  };

  const handleDelete = (index) => {
    const updatedOfficeDetails = [...officeDetails];
    updatedOfficeDetails.splice(index, 1);
    setOfficeDetails(updatedOfficeDetails);
  };

  // Define handleEdit function if needed
  const handleEdit = (index) => {
    // Implement your edit logic here
  };

  return (
    <div className="container mt-5">
      {/* Form section */}
      {showForm && (
        <div>
          <h2 style={{ color: '#007bff' }}>User Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>User ID</label>
              <input
                type="number"
                className="form-control"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Avatar</label>
              <input
                type="file"
                className="form-control-file"
                name="avatar"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
          <hr />
        </div>
      )}

      {/* Table section */}
      <div>
        <h2 style={{ color: '#007bff' }}>Master Details Table</h2>
        <table className="table">
          {/* Table headers */}
          <thead>
            <tr>
              <th>User ID</th>
              <th>Password</th>
              <th>Confirm Password</th>
              <th>Avatar</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {officeDetails.map((office, index) => (
              <tr key={index}>
                <td>{office.userId}</td>
                <td>{office.password}</td>
                <td>{office.confirmPassword}</td>
                <td>
                  <img
                    src={office.avatar}
                    alt={`Avatar of User ${office.userId}`}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
