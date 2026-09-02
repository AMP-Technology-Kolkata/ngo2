"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";

const BACKLINK = process.env.NEXT_PUBLIC_BACKLINK; // http://localhost:8001/api
const API_BASE = `${BACKLINK}/dashboard/manage_data`;

const SECTIONS = [
  {
    key: "village",
    title: "All Villages",
    route: "village",
    fields: [{ name: "name", label: "Village Name" }],
    columns: [{ key: "name", label: "Village Name" }],
  },
  {
    key: "post_office",
    title: "All Post Offices",
    route: "post_office",
    fields: [
      { name: "name", label: "Post Office Name" },
      { name: "pincode", label: "Pincode" },
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "pincode", label: "Pincode" },
    ],
  },
  {
    key: "police_station",
    title: "All Police Stations",
    route: "police_station",
    fields: [{ name: "name", label: "Police Station Name" }],
    columns: [{ key: "name", label: "Name" }],
  },
  {
    key: "sansad",
    title: "All Sansads",
    route: "sansad",
    fields: [
      { name: "name", label: "Sansad Name" },
      { name: "no", label: "Sansad No" },
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "no", label: "No" },
    ],
  },
  {
    key: "mouza",
    title: "All Mouzas",
    route: "mouza",
    fields: [{ name: "name", label: "Mouza Name" }],
    columns: [{ key: "name", label: "Name" }],
  },
  {
    key: "document_type",
    title: "All Documents",
    route: "document_type",
    fields: [{ name: "name", label: "Document Name" }],
    columns: [{ key: "name", label: "Name" }],
  },
  {
    key: "old_data_type",
    title: "All Old Data Types",
    route: "old_data_type",
    fields: [{ name: "name", label: "Type Name" }],
    columns: [{ key: "name", label: "Name" }],
  },
];


function Page() {
  // data[route] = array of rows
  const [data, setData] = useState({});
  const [loadingKey, setLoadingKey] = useState(null); // which section is loading

  // Add/Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [activeSection, setActiveSection] = useState(null);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    SECTIONS.forEach((section) => fetchSection(section));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    const fetchSection = async (section) => {
    setLoadingKey(section.key);
    try {
      const res = await axios.get(`${API_BASE}/${section.route}`, {
        withCredentials: true,
      });
      setData((prev) => ({ ...prev, [section.route]: res.data.data || [] }));
    } catch (err) {
      console.error(`Error fetching ${section.title}:`, err);
    } finally {
      setLoadingKey(null);
    }
  };

  // ---------- Add / Edit modal ----------
  const openAddModal = (section) => {
    setActiveSection(section);
    setModalMode("add");
    setEditId(null);
    const empty = {};
    section.fields.forEach((f) => (empty[f.name] = ""));
    setFormData(empty);
    setShowModal(true);
  };

  const openEditModal = (section, row) => {
    setActiveSection(section);
    setModalMode("edit");
    setEditId(row._id);
    const prefilled = {};
    section.fields.forEach((f) => (prefilled[f.name] = row[f.name] ?? ""));
    setFormData(prefilled);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveSection(null);
    setEditId(null);
    setFormData({});
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

    const handleSave = async () => {
    if (!activeSection) return;

    const hasEmpty = activeSection.fields.some(
      (f) => !String(formData[f.name] ?? "").trim(),
    );
    if (hasEmpty) {
      swal("Error!", "Please fill all fields", "error");
      return;
    }

    setSaving(true);
    try {
      if (modalMode === "add") {
        await axios.post(`${API_BASE}/${activeSection.route}/add`, formData, {
          withCredentials: true,
        });
        swal("Added!", `${activeSection.title} entry added.`, "success");
      } else {
        // Backend route: POST /:route/update  (id goes in body, not URL)
        await axios.post(
          `${API_BASE}/${activeSection.route}/update`,
          { id: editId, ...formData },
          { withCredentials: true },
        );
        swal("Updated!", `${activeSection.title} entry updated.`, "success");
      }
      closeModal();
      fetchSection(activeSection);
    } catch (err) {
      console.error("Error saving entry:", err);
      swal(
        "Error!",
        err.response?.data?.message || "Failed to save entry",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (section, row) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: `This will permanently delete "${row.name}".`,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/${section.route}/delete/${row._id}`, {
        withCredentials: true,
      });
      swal("Deleted!", "Entry has been deleted.", "success");
      fetchSection(section);
    } catch (err) {
      console.error("Error deleting entry:", err);
      swal(
        "Error!",
        err.response?.data?.message || "Failed to delete entry",
        "error",
      );
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h2 style={{ color: "#007bff", marginBottom: "1.5rem" }}>
        Manage Database
      </h2>

      <div className="row">
        {SECTIONS.map((section) => {
          const rows = data[section.route] || [];
          const isLoading = loadingKey === section.key;
          return (
            <div className="col-md-4 mb-4" key={section.key}>
              <div className="card shadow-sm h-100">
                <div className="card-header d-flex justify-content-between align-items-center bg-white">
                  <strong>{section.title}</strong>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => openAddModal(section)}
                  >
                    Add +
                  </button>
                </div>
                <div className="card-body p-0" style={{ maxHeight: 260, overflowY: "auto" }}>
                  <table className="table table-sm table-hover mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: 32 }}>#</th>
                        {section.columns.map((col) => (
                          <th key={col.key}>{col.label}</th>
                        ))}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan={section.columns.length + 2}
                            className="text-center py-3"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={section.columns.length + 2}
                            className="text-center py-3 text-muted"
                          >
                            No entries found.
                          </td>
                        </tr>
                      ) : (
                        rows.map((row, idx) => (
                          <tr key={row._id}>
                            <td>{idx + 1}</td>
                            {section.columns.map((col) => (
                              <td key={col.key}>{row[col.key] ?? "-"}</td>
                            ))}
                            <td>
                              <button
                                className="btn btn-primary btn-sm mr-1"
                                onClick={() => openEditModal(section, row)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(section, row)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== Add / Edit Modal ===== */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add a new" : "Edit"}{" "}
            {activeSection?.title.replace(/^All /, "")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeSection?.fields.map((f) => (
            <div className="form-group" key={f.name}>
              <label className="font-weight-bold">{f.label}</label>
              <input
                type="text"
                className="form-control"
                value={formData[f.name] ?? ""}
                onChange={(e) => handleFieldChange(f.name, e.target.value)}
              />
            </div>
          ))}
          <Button
            variant="success"
            className="mt-2"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : modalMode === "add" ? "Add" : "Update"}
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Page;