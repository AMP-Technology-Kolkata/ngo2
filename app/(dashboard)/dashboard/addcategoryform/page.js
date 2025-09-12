"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert";

function Page() {
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [editId, setEditId] = useState(null);

  // list
  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/category/list`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setCategoryDetails(response.data.data);
      } else {
        throw new Error("Failed to fetch category list");
      }
    } catch (error) {
      console.error("Error fetching category list:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch category list!",
        footer: "Please try again later.",
      });
    }
  };

  const handleNameChange = (event) => {
    const { name, value } = event.target;
    const trimmedValue = name === "name" ? value.trimStart() : value;
    setFormData({ ...formData, [name]: trimmedValue });
  };

  // showfrom
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      // console.log(formDataToSend );

      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/category/update/${editId}`,
          formData,
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/category/insert`,
          formData,
          {
            withCredentials: true,
          }
        );
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // delete
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
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/category/delete/${id}`,
          { withCredentials: true }
        );
        fetchCategoryList(); // Fetch updated notice list
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };
  // edit
  const handleEdit = (id) => {
    const categoryToEdit = categoryDetails.find(
      (category) => category._id === id
    );
    if (categoryToEdit) {
      setFormData({ name: categoryToEdit.name });
    }
    setEditId(id);
  };

  return (
    <div className="container mt-5">
      {/* <h2 style={{ color: "#007bff" }}> Details</h2> */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Designation: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editId ? "Update" : "Add"}
        </button>
      </form>
      <hr />
      <div>
        <h2 style={{ color: "#007bff" }}>Designations </h2>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryDetails.map((category, index) => (
              <tr key={index}>
                <td>{category.name}</td>
                <td>
                  <div className="d-flex align-self-center">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(category._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(category._id)}
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
