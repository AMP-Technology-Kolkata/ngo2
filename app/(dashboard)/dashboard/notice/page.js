"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";

function Page() {
  const today = new Date();
  today.setHours(today.getHours() + 5);
  const ISTstart_date = today.toISOString().slice(0, 16);

  const [notices, setNotices] = useState([]);
  const [formData, setFormData] = useState({
    // start_date: "",
    start_date: ISTstart_date,
    expiry_date: "",
    title: "",
    link: null,
    type: "notice",
  });
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch notice list on component mount
  useEffect(() => {
    fetchNotices();
  }, []);

  // Function to fetch notice list
  const fetchNotices = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/notice/list`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNotices(response.data.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  // Handle form input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    let trimmedValue = value;

    // Trim leading and trailing spaces if not in the middle of the input
    if (name !== "title") {
      trimmedValue = value.trim();
    } else {
      trimmedValue = value.replace(/^\s+/g, "");
    }
    setFormData({ ...formData, [name]: trimmedValue });
    validateForm();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, link: file });
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Regular expressions for validation
    const yearRegex = /^\d{4}$/;

    // Year validation
    if (
      !yearRegex.test(formData.start_date.split("-")[0]) ||
      !yearRegex.test(formData.expiry_date.split("-")[0])
    ) {
      errors.year = "Invalid Date Format";
      isValid = false;
    }

    // Expiry Date must be after Start Date
    if (
      formData.start_date &&
      formData.expiry_date &&
      formData.expiry_date <= formData.start_date
    ) {
      errors.date = "Expiry Date must be after Start Date";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("start_date", formData.start_date);
      formDataToSend.append("expiry_date", formData.expiry_date);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("link", formData.link);

      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/notice/update/${editId}`,
          formDataToSend,
          { withCredentials: true }
        );
        setEditId(null);
        swal("Success!", "Notice updated successfully!", "success");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/notice/insert`,
          formDataToSend,
          { withCredentials: true }
        );
        swal("Success!", "Notice added successfully!", "success");
      }
      fetchNotices();
      setFormData({ start_date: "", expiry_date: "", title: "", link: null });
    } catch (error) {
      swal("Error!", "Notice not added/updated!", "error");
      console.error("Error adding/updating notice:", error);
    }
  };

  // Handle deletion of notice
  const handleDelete = async (id) => {
    try {
      const shouldDelete = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this notice item!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (shouldDelete) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/notice/delete/${id}`,
          { withCredentials: true }
        );
        swal("Success!", "Notice deleted successfully!", "success");
        fetchNotices(); // Fetch updated notice list
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  // Handle editing of notice
  const handleEdit = (noticeItem) => {
    setFormData(noticeItem);
    setEditId(noticeItem._id);
    setShowForm(true);
  };

  // Toggle display of form
  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({ start_date: "", expiry_date: "", title: "", link: null });
    setEditId(null);
  };

  return (
    <div className="container pt-3">
      {showForm && (
        <div>
          <h2 style={{ color: "#007bff" }}>Add Notices</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Start Date <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="datetime-local"
                className="form-control"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
              {errors.year && <p className="text-danger">{errors.year}</p>}
            </div>
            <div className="form-group">
              <label>
                Expiry Date <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="datetime-local"
                className="form-control"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                required
              />
              {errors.date && <p className="text-danger">{errors.date}</p>}
            </div>
            <div className="form-group">
              <label>
                Title{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max length: 150 characters)
                </span>
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Type
                <span style={{ color: "red" }}>*</span>
              </label>
              <select
                class="form-select"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="notice">Notice</option>
                <option value="tender">Tender</option>
                <option value="notification">Notification</option>
              </select>
            </div>
            <div className="form-group">
              <label>PDF </label>
              <input
                type="file"
                className="form-control"
                name="link"
                onChange={handleFileChange}
                accept="application/pdf"
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

      <div className="card-body">
        <h2 style={{ color: "#007bff" }}>Notices</h2>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>Expiry Date</th>
              <th>Title</th>
              <th>Type</th>
              <th>Pdf</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((noticeItem) => (
              <tr key={noticeItem._id}>
                <td>{noticeItem.start_date}</td>
                <td>{noticeItem.expiry_date}</td>
                <td>{noticeItem.title}</td>
                <td>{noticeItem.type}</td>
                <td>
                  <a
                    href={`${
                      process.env.NEXT_PUBLIC_BACKPUBLIC
                    }/${noticeItem.link?.slice(7)}`}
                    className="btn btn-secondary"
                    target="_blank"
                  >
                    View Pdf
                  </a>
                </td>
                <td>
                  <div className="d-flex align-self-center">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(noticeItem)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(noticeItem._id)}
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
            Add Notice
          </button>
        )}
      </div>
    </div>
  );
}

export default Page;
