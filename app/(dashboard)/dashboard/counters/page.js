"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

function Page() {
  const [counters, setCounters] = useState([]);
  const [formData, setFormData] = useState({
    text: "",
    value: "",
  });
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCounters();
  }, []);

  // Function to fetch counter list
  const fetchCounters = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/counter/list`,
        { withCredentials: true }
      );
      console.log(response.data?.data);
      setCounters(response.data?.data?.counter);
    } catch (error) {
      console.error("Error fetching counters:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/counter/update/${editId}`,
          formData,
          { withCredentials: true }
        );
        setEditId(null);
        swal("Success", "Counter updated successfully!", "success");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/counter/insert`,
          formData,
          { withCredentials: true }
        );
        swal("Success", "Counter added successfully!", "success");
      }
      fetchCounters(); // Fetch updated counter list
      setFormData({ text: "", value: "" });
    } catch (error) {
      swal("Error", "Counter not added/updated!", "error");
      swal(
        "Error",
        error.response?.data?.errors || "Counter not added/updated!",
        "error"
      );
      console.log(error);
    }
  };

  // Handle deletion of counter
  const handleDelete = async (id) => {
    try {
      const shouldDelete = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this counter item!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (shouldDelete) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/counter/delete/${id}`,
          { withCredentials: true }
        );
        swal("Success", "Counter deleted successfully!", "success");
        fetchCounters(); // Fetch updated counter list
      }
    } catch (error) {
      console.error("Error deleting counter:", error);
    }
  };

  // Handle editing of counter
  const handleEdit = (counterItem) => {
    setFormData(counterItem);
    setEditId(counterItem._id);
    setShowForm(true);
  };

  // Toggle display of form
  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({ text: "", value: "" });
    setEditId(null);
  };

  return (
    <div className="container pt-3">
      {showForm && (
        <div>
          <h2 style={{ color: "#007bff" }}>Add Counter</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Text</label>
              <input
                type="text"
                className="form-control"
                name="text"
                value={formData.text}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Value</label>
              <input
                type="number"
                className="form-control"
                name="value"
                value={formData.value}
                onChange={handleChange}
                required
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
        <h2 style={{ color: "#007bff" }}>Counters</h2>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Text</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {counters.map((counterItem) => (
              <tr key={counterItem._id}>
                <td>{counterItem.text}</td>
                <td>{counterItem.value}</td>
                <td>
                  <div className="d-flex align-self-center">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(counterItem)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(counterItem._id)}
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
            Add Counter Item
          </button>
        )}
      </div>
    </div>
  );
}

export default Page;
