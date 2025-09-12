"use client";

import React, { useState } from "react";

const Page = () => {
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [officeDetails, setOfficeDetails] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleMobileNoChange = (event) => {
    setMobileNo(event.target.value);
  };
  const handleRecipientChange = (event) => {
    setSelectedRecipients(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
  };
//   const 

  const handleSubmit = (event) => {
    event.preventDefault();
    const newOffice = { name, mobileNo, slno: officeDetails.length + 1 };
    setOfficeDetails([...officeDetails, newOffice]);
    setName("");
    setMobileNo("");
  };

  const handleEdit = (index) => {
    // Add logic for editing office details
    console.log("Editing office details at index:", index);
  };

  const handleDelete = (index) => {
    // Add logic for deleting office details
    setOfficeDetails(officeDetails.filter((_, i) => i !== index));
  };

  return (
    <div className="container-fluid" style={{ paddingTop: "40px" }}>
      <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Select Category:</label>
            <select
              value={selectedRecipients}
              onChange={handleRecipientChange}
              style={{
                marginLeft: "5px",
                padding: "5px",
                borderRadius: "3px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            >
              <option value="">Select a Category</option>
              <option value="Category1">Category 1</option>
              <option value="Category2">Category 2</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Recipient Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="mobileNo" className="form-label">
              Mobile Number:
            </label>
            <input
              type="text"
              className="form-control"
              id="mobileNo"
              value={mobileNo}
              onChange={handleMobileNoChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      </div>
      <div>
        <hr />
        <h2 style={{ color: '#007bff', marginTop:'20px'}}>Recipient Details</h2>
        <table className="table">
          {/* Table headers */}
          <thead>
            <tr>
              <th>SL No.</th>
              <th>Category</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {officeDetails.map((office, index) => (
              <tr key={index}>
                <td>{office.slno}</td>
                <td>{office.category}</td>
                <td>{office.name}</td>
                <td>{office.mobileNo}</td>
                <td>
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => handleEdit(index)}
                    key={"edit" + index}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(index)}
                    key={"delete" + index}
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
};

export default Page;
