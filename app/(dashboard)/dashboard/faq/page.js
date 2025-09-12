"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";

function Page() {
  const [faq, setFaq] = useState([]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
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
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/faq/list`,
        { withCredentials: true }
      );
      setFaq(response.data.data);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "question" || name === "answer") {
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
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/faq/update/${editId}`,
          formData,
          { withCredentials: true }
        );
        setEditId(null);
        swal("Success", "FAQ updated successfully!", "success");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/faq/insert`,
          formData,
          { withCredentials: true }
        );
        swal("Success", "FAQ added successfully!", "success");
      }
      fetchFAQ(); // Fetch updated FAQ list
      setFormData({ question: "", answer: "" });
    } catch (error) {
      swal("Error", "FAQ not added!", "error");
      console.error("Error adding/updating FAQ:", error);
    }
  };

  // Handle deletion of FAQ
  const handleDelete = async (id) => {
    try {
      const shouldDelete = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this FAQ item!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (shouldDelete) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/faq/delete/${id}`,
          { withCredentials: true }
        );
        swal("Success", "FAQ deleted successfully!", "success");
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
    setFormData({ question: "", answer: "" });
    setEditId(null);
  };

  return (
    <div className="container mt-5">
      {showForm && (
        <div>
          <h2 style={{ color: "#007bff" }}>Add FAQ</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Question{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max length: 250 characters)
                </span>{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Answer <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                type="text"
                className="form-control"
                name="answer"
                value={formData.answer}
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
        <h2 style={{ color: "#007bff" }}> FAQ </h2>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faq.map((faqItem, index) => (
              <tr key={faqItem._id}>
                <td>{faqItem.question}</td>
                <td>{faqItem.answer}</td>
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
        {!showForm && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={toggleForm}
          >
            Add FAQ Item
          </button>
        )}
      </div>
    </div>
  );
}

export default Page;
