"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";

function Page() {
  const [videos, setVideos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
  });
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState(null);

  // listshow
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/video_gallery/list`,
        { withCredentials: true }
      );
      setVideos(response.data.data);
    } catch (error) {
      console.error("Error fetching Videos:", error);
    }
  };
  // form SubmitEventmi
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "title" || name === "link") {
      newValue = value.trimStart();
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/video_gallery/insert`,
        formData,
        { withCredentials: true }
      );
      swal("Success", "Video added successfully!", "success");
      fetchVideos();
      setFormData({ title: "", link: "" });
    } catch (error) {
      console.error("Error adding/updating Video:", error);
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
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/video_gallery/delete/${id}`,
          { withCredentials: true }
        );
        swal("Success", "Video deleted successfully!", "success");
        fetchVideos();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
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
          <h2 style={{ color: "#007bff" }}>Add Video </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Title{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max length: 100 characters)
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
              <label>Link (Youtube only)</label>{" "}
              <span style={{ color: "red" }}>*</span>
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
              Submit
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
        <h2 style={{ color: "#007bff" }}>Videos</h2>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Title</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video._id}>
                <td>{video.title}</td>
                <td>
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {video.link}
                  </a>
                </td>
                <td>
                  <div className="d-flex align-self-center">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(video._id)}
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
            Add Video
          </button>
        )}
      </div>
    </div>
  );
}

export default Page;
