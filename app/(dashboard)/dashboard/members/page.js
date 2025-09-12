"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";

function Page() {
  const [peoples, setPeoples] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    designation: "",
    link: "",
    image: null,
  });
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState(null);

  // listshow
  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/people/list`,
        { withCredentials: true }
      );
      setPeoples(response.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  // form SubmitEventmi
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let newValue = value;

    if (name === "image" && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    } else {
      if (["name", "about", "link", "designation"].includes(name)) {
        newValue = value.trimStart();
      }
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();

    submitData.append("name", formData.name);
    submitData.append("about", formData.about);
    submitData.append("designation", formData.designation);
    submitData.append("link", formData.link);
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    try {
      if (editId) {
        // Edit existing entry
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/people/update/${editId}`,
          submitData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        swal("Success", "People updated successfully!", "success");
      } else {
        // Add new entry
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/people/insert`,
          submitData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        swal("Success", "People added successfully!", "success");
      }

      fetchPeople();
      setFormData({
        id: null,
        name: "",
        about: "",
        link: "",
        designation: "",
        image: null,
      });
      setEditId(null);
    } catch (error) {
      console.error("Error adding/updating people:", error);
    }
  };

  // delete
  const handleEdit = (person) => {
    const personToEdit = person;
    setFormData({
      name: personToEdit.name,
      about: personToEdit.about,
      designation: personToEdit.designation,
      link: personToEdit.link,
      image: null, // Reset the image field as we don't want to overwrite unless a new image is selected
    });
    setEditId(person._id);
    setShowForm(true);
  };

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
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/people/delete/${id}`,
          { withCredentials: true }
        );
        swal("Success", "Service deleted successfully!", "success");
        fetchPeople();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({
      name: "",
      about: "",
      designation: "",
      link: "",
      image: null,
    });
    setEditId(null);
  };

  return (
    <div className="container pt-3">
      {showForm && (
        <div>
          <h2 style={{ color: "#007bff" }}>Add Members </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Name{" "}
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
                  {/* (max length: 250 characters) */}
                </span>{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                className="form-control"
                name="about"
                onChange={handleChange}
                value={formData.about}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Designation{" "}
                <span className="font-italic text-sm font-weight-light">
                  {/* (max length: 250 characters) */}
                </span>{" "}
              </label>
              <input
                type="text"
                className="form-control"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Link</label>
              <input
                type="url"
                className="form-control"
                name="link"
                value={formData.link}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Image</label> <span style={{ color: "red" }}>*</span>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={handleChange}
                required={editId ? false : true}
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
        <h2 style={{ color: "#007bff" }}>Members</h2>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Name</th>
              <th>About</th>
              <th>Designation</th>
              <th>Link</th>
              <th>Photo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {peoples.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.about}</td>
                <td>{p.designation}</td>
                <td>
                  <a href={p.link} target="_blank" rel="noopener noreferrer">
                    {p.link}
                  </a>
                </td>
                <td>
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKPUBLIC}/${p.image.slice(
                      7
                    )}`}
                    alt="avatar"
                    width={150}
                    height={200}
                  />
                </td>
                <td>
                  <div className="d-flex align-self-center">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(p._id)}
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
