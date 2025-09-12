"use client";

// export default Page;
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert";

function Page() {
  const [galleryDetails, setGalleryDetails] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    galleryImage: "",
  });
  const [showForm, setShowForm] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState(null);
  // list
  useEffect(() => {
    fetchGalleryDetails();
  }, []);

  const fetchGalleryDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/gallery/list`,
        { withCredentials: true }
      );
      setGalleryDetails(response.data.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching gallery details:", error);
      setError("Error fetching gallery details");
    }
  };
  // add
  const handleChange = (event) => {
    const { name, value, files } = event.target;

    const newValue = name === "description" ? value.trimStart() : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "galleryImage" ? files[0] : newValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.description === "" || !formData.galleryImage) {
      alert("Description and Image is required!");
      return;
    }
    if (formData.galleryImage?.size > 512 * 1024) {
      alert("Image size should be less than 512kb");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("description", formData.description);
    formDataToSend.append("galleryImage", formData.galleryImage);

    try {
      if (editIndex !== null) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/gallery/update/${galleryDetails[editIndex]._id}`,
          formDataToSend,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setEditIndex(null);
        Swal("Success", "Gallery Image updated successfully!", "success");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/gallery/insert`,
          formDataToSend,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Swal("Success", "New Gallery Image added successfully!", "success");
      }
      fetchGalleryDetails();
      setFormData({ description: "", galleryImage: "" });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: "Please try again later.",
      });
    }
  };

  // delete
  const handleDelete = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this item!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/gallery/delete/${id}`,
            { withCredentials: true }
          );
          fetchGalleryDetails();
          setError(null);
          swal("Deleted Successfully!", {
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting gallery item:", error);
          setError("Error deleting gallery item");
        }
      }
    });
  };

  // edit
  const handleEdit = (index) => {
    window.scrollTo(0, 0);
    setFormData({
      description: galleryDetails[index].description,
      galleryImage:
        "${process.env.NEXT_PUBLIC_BACKPUBLIC}/" +
        galleryDetails[index].galleryImage?.slice(7),
    });

    setEditIndex(index);
    setShowForm(true);
  };
  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({ description: "", galleryImage: "" });
    setEditIndex(null);
  };

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      {showForm && (
        <div>
          <h2 style={{ color: "#007bff" }}> Add Gallery </h2>
          <form method="post" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Description{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max length: 500 characters)
                </span>{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                // type="text"
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>
                Image{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max size: 512KB , 300px X 200px)
                </span>
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="file"
                className="form-control-file"
                name="galleryImage"
                onChange={handleChange}
                accept="image/jpg, image/jpeg, image/png"
                // required={!editIndex}
              />
            </div>
            <button type="submit" className="btn btn-primary mr-2">
              {editIndex !== null ? "Update" : "Submit"}
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

      {/* Table section */}
      <div>
        <h2 style={{ color: "#007bff" }}>Gallery </h2>
        <table className="table table-responsive">
          {/* Table headers */}
          <thead>
            <tr>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {galleryDetails.map((item, index) => (
              <tr key={item._id}>
                <td>{item.description}</td>
                <td>
                  <img
                    src={item.image}
                    alt={`Image of ${item.description}`}
                    style={{ width: "350px", height: "200px" }}
                  />
                </td>
                <td>
                  <div className="d-flex align-self-center">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item._id)}
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
            Add Gallary
          </button>
        )}
      </div>
    </div>
  );
}

export default Page;
