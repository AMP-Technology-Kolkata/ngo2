"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";

const BACKLINK = process.env.NEXT_PUBLIC_BACKLINK; // e.g. http://localhost:8001/api
// Route mount: app.use("/api/dashboard/application", verifyJWT, applicationAdminRouter)
const API_BASE = `${BACKLINK}/dashboard/application`;

// TODO: confirm — hardcoded for now; move to master-data driven list if backend has one
const APPLICATION_TYPES = [
  "Character",
  "Residential",
  "Income",
  "Nationality",
  "Caste",
  "Heirship",
];

function Page() {
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDir, setSortDir] = useState("asc");

  // Add/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editId, setEditId] = useState(null);
  const [formType, setFormType] = useState(APPLICATION_TYPES[0]);
  const [formText, setFormText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/guidelines`, {
        withCredentials: true,
      });
      setGuidelines(res.data.data || []);
    } catch (err) {
      console.error("Error fetching guidelines:", err);
      swal("Error!", "Failed to load guidelines", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Add ----------
  const openAddModal = () => {
    setModalMode("add");
    setEditId(null);
    setFormType(APPLICATION_TYPES[0]);
    setFormText("");
    setShowModal(true);
  };

  // ---------- Edit ----------
  const openEditModal = (row) => {
    setModalMode("edit");
    setEditId(row._id);
    setFormType(row.form_type);
    setFormText(row.guidelines || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormType(APPLICATION_TYPES[0]);
    setFormText("");
  };

  const handleSave = async () => {
    if (!formType) {
      swal("Error!", "Please select an application type", "error");
      return;
    }
    if (!formText.trim()) {
      swal("Error!", "Please enter guideline text", "error");
      return;
    }

    // NOTE: backend field is `form_type`, not `application_type`
    const payload = { form_type: formType, guidelines: formText };

    setSaving(true);
    try {
      if (modalMode === "add") {
        await axios.post(`${API_BASE}/guidelines/add`, payload, {
          withCredentials: true,
        });
        swal("Added!", "Guideline added successfully.", "success");
      } else {
        // backend's updateGuideline filters by form_type (office + form_type),
        // not by id — so no `id` needed in the payload
        await axios.post(`${API_BASE}/guidelines/update`, payload, {
          withCredentials: true,
        });
        swal("Updated!", "Guideline updated successfully.", "success");
      }
      closeModal();
      fetchGuidelines();
    } catch (err) {
      console.error("Error saving guideline:", err);
      const status = err.response?.status;
      if (status === 409) {
        swal(
          "Already exists!",
          "A guideline for this application type already exists. Edit it instead of adding a new one.",
          "warning",
        );
      } else {
        swal(
          "Error!",
          err.response?.data?.message || "Failed to save guideline",
          "error",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (row) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: `This will permanently delete the guideline for "${row.form_type}".`,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/guidelines/delete/${row._id}`, {
        withCredentials: true,
      });
      swal("Deleted!", "Guideline has been deleted.", "success");
      fetchGuidelines();
    } catch (err) {
      console.error("Error deleting guideline:", err);
      swal(
        "Error!",
        err.response?.data?.message || "Failed to delete guideline",
        "error",
      );
    }
  };

  // ---------- Search + Sort + Paginate ----------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...guidelines];
    if (q) {
      list = list.filter((g) =>
        [g.form_type, g.guidelines]
          .filter(Boolean)
          .some((val) => val.toString().toLowerCase().includes(q)),
      );
    }
    list.sort((a, b) => {
      const valA = (a.form_type || "").toLowerCase();
      const valB = (b.form_type || "").toLowerCase();
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [guidelines, search, sortDir]);

  const totalEntries = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const pageStart = (currentPage - 1) * entriesPerPage;
  const paginated = filtered.slice(pageStart, pageStart + entriesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  const toggleSort = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  return (
    <div className="container-fluid mt-4">
      <h2 style={{ color: "#007bff", marginBottom: "1.5rem" }}>
        Manage Guidelines
      </h2>

      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        Add a new Guideline
      </button>

      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <div className="d-flex align-items-center">
          <label className="mr-2 mb-0">
            <select
              className="form-control d-inline-block"
              style={{ width: "80px" }}
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>{" "}
            entries per page
          </label>
        </div>
        <div className="d-flex align-items-center">
          <label className="mr-2 mb-0">Search:</label>
          <input
            type="text"
            className="form-control"
            style={{ width: "220px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guidelines..."
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover bg-white">
          <thead className="thead-light">
            <tr>
              <th style={{ cursor: "pointer" }} onClick={toggleSort}>
                Type {sortDir === "asc" ? "▲" : "▼"}
              </th>
              <th>Guideline</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No guidelines found.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row._id}>
                  <td className="text-capitalize">{row.form_type}</td>
                  <td
                    style={{
                      maxWidth: 400,
                      whiteSpace: "pre-wrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.guidelines}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm mr-1"
                      onClick={() => openEditModal(row)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(row)}
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

      <div className="d-flex justify-content-between align-items-center">
        <span>
          Showing {totalEntries === 0 ? 0 : pageStart + 1} to{" "}
          {Math.min(pageStart + entriesPerPage, totalEntries)} of{" "}
          {totalEntries} entries
        </span>
        <div className="d-flex" style={{ gap: "4px" }}>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            «
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ‹
          </button>
          <button className="btn btn-sm btn-primary" disabled>
            {currentPage}
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            ›
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            »
          </button>
        </div>
      </div>

      {/* ===== Add / Edit Modal ===== */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add Guidelines" : "Edit Guidelines"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label className="font-weight-bold">Application Type</label>
            <select
              className="form-control"
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              disabled={modalMode === "edit"}
            >
              {APPLICATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="font-weight-bold">Guidelines</label>
            <textarea
              className="form-control"
              rows={10}
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              placeholder="Enter guideline text..."
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Page;