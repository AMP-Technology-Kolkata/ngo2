"use client";
import axios from "axios";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";

function Page() {
  const [advertisements, setAdvertisements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    url: "",
  });
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState(null);

  // listshow
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/ads/list`,
        { withCredentials: true }
      );
      setAdvertisements(response.data.data);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let newValue = value;

    // Remove leading spaces for "title" and "url" fields
    if (name === "title" || name === "url") {
      newValue = value.trimStart();
    }

    // Check if file input
    const newFile = name === "image" ? files[0] : null;

    setFormData({ ...formData, [name]: newValue, image: newFile });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Handle edit
      } else {
        // Handle new submission
        const formDataUpload = new FormData();
        formDataUpload.append("title", formData.title);
        formDataUpload.append("image", formData.image);
        formDataUpload.append("url", formData.url);

        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/ads/insert`,
          formDataUpload,
          { withCredentials: true }
        );
      }
      swal("Success!", "Advertisement added/updated successfully!", "success");
      fetchAdvertisements();
      setFormData({ title: "", image: null, url: "" });
    } catch (error) {
      swal("Error!", "Advertisement not added/updated!", "error");
      console.error("Error adding/updating advertisement:", error);
    }
  };

  // delete
  const handleDelete = async (id) => {
    try {
      const shouldDelete = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this advertisement!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (shouldDelete) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/ads/delete/${id}`,
          { withCredentials: true }
        );
        swal("Success!", "Advertisement deleted successfully!", "success");
        fetchAdvertisements();
      }
    } catch (error) {
      swal("Error!", "Advertisement not deleted!", "error");
      console.error("Error deleting advertisement:", error);
    }
  };

  //   const handleEdit = (advertisement) => {
  //     setFormData({
  //       title: advertisement.title,
  //       image: null,
  //       url: advertisement.url,
  //     });
  //     setEditId(advertisement._id);
  //     setShowForm(true);
  //   };

  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({ title: "", image: null, url: "" });
    setEditId(null);
  };

  return (
    <div className="container mt-5">
      {showForm && (
        <div>
          <h2 style={{ color: "#007bff" }}> Add Ads </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Title{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max length: 100 characters)
                </span>{" "}
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
                URL
                <span className="font-italic text-sm font-weight-light">
                  (Optional)
                </span>
              </label>
              <input
                type="text"
                className="form-control"
                name="url"
                value={formData.url}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>
                Image{" "}
                <span className="font-italic text-sm font-weight-light">
                  (recomended: 350 x 200 px, max size: 512KB)
                </span>
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="file"
                className="form-control-file"
                name="image"
                onChange={handleChange}
                accept="image/jpg, image/jpeg, image/png"
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
        <h2 style={{ color: "#007bff" }}>Ads </h2>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Title</th>
              <th>Image</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {advertisements.map((advertisement, index) => (
              <tr key={index}>
                <td>{advertisement.title}</td>
                <td>
                  <Image
                    src={advertisement.image}
                    alt={`Image of ${advertisement.title}`}
                    width={200}
                    height={200}
                  />
                </td>
                <td>
                  <a
                    href={advertisement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {advertisement.url}
                  </a>
                </td>
                <td>
                  <div className="d-flex align-self-center">
                    {/* <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(advertisement)}
                    >
                      Edit
                    </button> */}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(advertisement._id)}
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
            Add Ads
          </button>
        )}
      </div>
    </div>
  );
}

export default Page;
