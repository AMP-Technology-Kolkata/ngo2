"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";

function StaffDetailsPage() {
  const [staffList, setStaffList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    email: "",
    age: "",
    gender: "",
    category: "",
    designation: "",
    mobile: "",
    facebook: "",
    twitter: "",
    linkedin: "",
  });
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState(null);
  const [mobileError, setMobileError] = useState("");
  const [ageError, setAgeError] = useState("");

  const validateMobile = (mobile) => {
    const regex = /^\d{10}$/;
    return regex.test(mobile);
  };
  const validateAge = (age) => {
    const regex = /^\d{2}$/;
    return regex.test(age);
  };

  // Fetch staff members and categories on component mount
  useEffect(() => {
    fetchStaffList();
    fetchCategories();
  }, []);

  // Fetch staff members from the API
  const fetchStaffList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/staffs/list`,
        { withCredentials: true }
      );
      setStaffList(response.data.data);
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/category/list`,
        { withCredentials: true }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let newValue = value;
    if (
      name === "name" ||
      name === "email" ||
      name === "age" ||
      name === "facebook" ||
      name === "twitter" ||
      name === "linkedin"
    ) {
      newValue = value.trimStart();
    }
    const updatedValue = name === "avatar" ? files[0] : newValue;
    setFormData({ ...formData, [name]: updatedValue });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // mobile validation
    try {
      const isValidMobile = validateMobile(formData.mobile.trim());
      if (!isValidMobile) {
        setMobileError("Mobile number must be 10 digits");
        return;
      } else {
        setMobileError("");
      }

      const isValidAge = validateAge(formData.age);
      if (!isValidAge) {
        setAgeError("Age must be more than 18 <100");
        return;
      } else {
        setAgeError("");
      }
    } catch (error) {
      console.error("Error adding/updating staff:", error);
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("avatar", formData.avatar);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("facebook", formData.facebook);
      formDataToSend.append("twitter", formData.twitter);
      formDataToSend.append("linkedin", formData.linkedin);

      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/staffs/update/${editId}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        swal("Success!", "Staff updated successfully!", "success");
        setEditId(null);
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/staffs/insert`,
          formDataToSend,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        swal("Success!", "Staff added successfully!", "success");
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      swal("Error!", "Something went wrong!", "error");
      console.error("Error adding/updating staff:", error);
    }
  };

  // Handle staff deletion
  const handleDelete = async (id) => {
    try {
      const shouldDelete = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this staff member!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (shouldDelete) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/staffs/delete/${id}`,
          { withCredentials: true }
        );
        swal("Success!", "Staff member deleted successfully!", "success");
        fetchStaffList();
      }
    } catch (error) {
      console.error("Error deleting staff member:", error);
    }
  };

  // Handle editing staff details
  const handleEdit = (staff) => {
    window.scrollTo(0, 0);
    setFormData({
      name: staff.name,
      avatar: staff.avatar,
      email: staff.email,
      age: staff.age,
      gender: staff.gender,
      category: staff.category._id,
      designation: staff.designation,
      mobile: staff.mobile,
      facebook: staff.facebook,
      twitter: staff.twitter,
      linkedin: staff.linkedin,
    });
    setEditId(staff._id);
    setShowForm(true);
  };

  // Toggle form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({
      name: "",
      avatar: "",
      email: "",
      age: "",
      gender: "",
      category: "",
      designation: "",
      mobile: "",
      facebook: "",
      twitter: "",
      linkedin: "",
    });
    setEditId(null);
  };

  return (
    <div className="container pt-3">
      {showForm && (
        <div>
          <h2 style={{ color: "#007bff" }}> Add Staffs</h2>
          <form method="post" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Name <span style={{ color: "red" }}>*</span>
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
                Avatar{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max size: 512KB , 100px X 100px)
                </span>
              </label>
              <input
                type="file"
                className="form-control"
                name="avatar"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>
                Age <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
              {ageError && <div className="text-danger">{ageError}</div>}
            </div>
            <div className="form-group">
              <label>
                Gender <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="form-control"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Gender <span style={{ color: "red" }}>*</span>
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Designation <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="form-control"
                name="category"
                value={formData.category ? formData.category._id : ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Designation</option>
                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                    selected={
                      formData.category && formData.category === category._id
                    }
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>
                Mobile <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
              {mobileError && <div className="text-danger">{mobileError}</div>}
            </div>
            <div className="row">
              <div className="form-group col-4">
                <label>Facebook</label>
                <input
                  type="url"
                  className="form-control"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group col-4">
                <label>Twitter</label>
                <input
                  type="url"
                  className="form-control"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group col-4">
                <label>Linkedin</label>
                <input
                  type="url"
                  className="form-control"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary mr-2">
              {editId ? "Update" : "ADD"}
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
        <h2 style={{ color: "#007bff" }}>Staffs </h2>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Name</th>
              <th>Avatar</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              {/* <th>Designation</th> */}
              <th>Designation</th>
              <th>Mobile Number</th>
              <th>Socail Links</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff._id}>
                <td>{staff.name}</td>
                <td>
                  {staff.avatar && (
                    <img
                      src={staff.avatar}
                      alt={`Avatar of ${staff.name}`}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
                </td>
                <td>{staff.email}</td>
                <td>{staff.age}</td>
                <td>{staff.gender}</td>
                {/* <td>{staff.designation}</td> */}
                <td>{staff.category ? staff.category.name : ""}</td>
                <td>{staff.mobile}</td>
                <td>
                  {staff.facebook} <br /> {staff.twitter} <br />
                  {staff.linkedin}
                </td>
                <td>
                  <div className="d-flex align-self-center">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(staff)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(staff._id)}
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
            Add Staff
          </button>
        )}
      </div>
    </div>
  );
}
export default StaffDetailsPage;
