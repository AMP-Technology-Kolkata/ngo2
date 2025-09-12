"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert";

function Page() {
  const [error, setError] = useState("");
  const [contactDetails, setContactDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRemarks, setSelectedRemarks] = useState("");
  const [selectedContactIndex, setSelectedContactIndex] = useState(null);

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/grievance/list`,
        { withCredentials: true }
      );
      setContactDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching contact details:", error);
      setError("Error fetching contact details");
    }
  };

  const handleEdit = (index) => {
    const contact = contactDetails[index];
    setSelectedStatus(contact.status);
    setSelectedRemarks(contact.remarks);
    setSelectedContactIndex(index);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleUpdate = async () => {
    try {
      const id = contactDetails[selectedContactIndex]._id;
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/grievance/update/${id}`,
        { status: selectedStatus, remarks: selectedRemarks },
        { withCredentials: true }
      );

      setShowModal(false);
      fetchContactDetails();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating contact details:", error);
      setError("Error updating contact details");
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
            `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/grievance/delete/${id}`,
            { withCredentials: true }
          );
          fetchContactDetails();
          swal("Deleted Successfully!", {
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting contact:", error);
          setError("Error deleting contact");
        }
      }
    });
  };

  return (
    <div className="container mt-5">
      <h2 style={{ color: "#007bff" }}> Contact us </h2>
      <table className="table table-responsive">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Location</th>
            <th>Message</th>
            <th>File</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contactDetails.map((item, index) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.location}</td>
              <td>{item.message}</td>
              <td>
                {item.file && (
                  <a
                    href={`${
                      process.env.NEXT_PUBLIC_BACKPUBLIC
                    }/${item.file.slice(7)}`}
                    target="_blank"
                  >
                    View
                  </a>
                )}
              </td>
              <td>{item.status}</td>
              <td>{item.remarks}</td>
              <td>
                <div className="d-flex align-self-center">
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => handleEdit(index)}
                  >
                    Update
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

      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contact Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="new">new</option>
              <option value="pending">Pending</option>
              <option value="closed">Close</option>
            </select>
          </div>
          <div>
            <label>Remarks:</label>
            <textarea
              value={selectedRemarks}
              onChange={(e) => setSelectedRemarks(e.target.value)}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Page;
