"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";

function Page() {
  const [links, setLinks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
  });
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState(null);

  // Fetch FAQ list on component mount
  useEffect(() => {
    fetchFAQ();
  }, []);

  // Function to fetch FAQ list
  const fetchFAQ = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/useful_links/list`,
        { withCredentials: true }
      );
      setLinks(response.data.data);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "name" || name === "link") {
      newValue = value.trimStart();
    }
    setFormData({ ...formData, [name]: newValue });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/useful_links/update/${editId}`,
          formData,
          { withCredentials: true }
        );
        setEditId(null);
        swal("Success", "Useful link updated successfully!", "success");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/useful_links/insert`,
          formData,
          { withCredentials: true }
        );
        swal("Success", "Useful link added successfully!", "success");
      }
      setFormData({ name: "", link: "" });
      fetchFAQ(); // Fetch updated FAQ list
    } catch (error) {
      swal("Error", "Useful link not added!", "error");
      console.error("Error adding/updating Useful link:", error);
    }
  };

  // Handle deletion of FAQ
  const handleDelete = async (id) => {
    try {
      const shouldDelete = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this item!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (shouldDelete) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/useful_links/delete/${id}`,
          { withCredentials: true }
        );
        swal("Success", "Useful link deleted successfully!", "success");
        fetchFAQ(); // Fetch updated FAQ list
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  // Handle editing of FAQ
  const handleEdit = (faqItem) => {
    setFormData(faqItem);
    setEditId(faqItem._id);
    setShowForm(true);
  };

  // Toggle display of form
  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({ name: "", link: "" });
    setEditId(null);
  };

  return (
    <div className="container pt-3">
      {showForm && (
        <div>
          <h2 style={{ color: "#007bff" }}>Add Useful Links</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Name{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max length: 200 characters)
                </span>{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={200}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Link <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="url"
                className="form-control"
                name="link"
                value={formData.link}
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
      {!showForm && (
        <button
          type="button"
          className="btn btn-primary my-3"
          onClick={toggleForm}
        >
          Add Useful Link
        </button>
      )}

      <div>
        <h2 style={{ color: "#007bff" }}> Useful Links </h2>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Name</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((faqItem, index) => (
              <tr key={faqItem._id}>
                <td>{faqItem.name}</td>
                <td>{faqItem.link}</td>
                <td>
                  <div className="d-flex align-self-center">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(faqItem)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(faqItem._id)}
                    >
                      Delete
                    </button>
                  </div>
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
