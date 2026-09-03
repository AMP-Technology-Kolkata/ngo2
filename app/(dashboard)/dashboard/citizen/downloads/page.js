"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";

const BACKLINK = process.env.NEXT_PUBLIC_BACKLINK; // http://localhost:8001/api
const API_BASE = `${BACKLINK}/dashboard/application/downloads`;

function Page() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Search + pagination
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE, { withCredentials: true });
      setRows(res.data.data || []);
    } catch (err) {
      console.error("Error fetching downloads:", err);
      swal("Error!", "Failed to load files", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Add modal ----------
  const openAddModal = () => {
    setTitle("");
    setFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      swal("Error!", "Please enter a title", "error");
      return;
    }
    if (!file) {
      swal("Error!", "Please select a file", "error");
      return;
    }

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("file", file);

    setSaving(true);
    try {
      await axios.post(`${API_BASE}/add`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      swal("Added!", "File added successfully.", "success");
      closeModal();
      fetchDownloads();
    } catch (err) {
      console.error("Error saving file:", err);
      swal(
        "Error!",
        err.response?.data?.message || "Failed to save file",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (row) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: `This will permanently delete "${row.title}".`,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/delete/${row._id}`, {
        withCredentials: true,
      });
      swal("Deleted!", "File has been deleted.", "success");
      fetchDownloads();
    } catch (err) {
      console.error("Error deleting file:", err);
      swal(
        "Error!",
        err.response?.data?.message || "Failed to delete file",
        "error",
      );
    }
  };

  const handleDownload = (row) => {
    if (!row.file) {
      swal("Error!", "File URL not found", "error");
      return;
    }
    window.open(row.file, "_blank");
  };

  // ---------- Search + Pagination (client side) ----------
  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    return rows.filter((r) =>
      r.title?.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [rows, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / entriesPerPage),
  );
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredRows.slice(start, start + entriesPerPage);
  }, [filteredRows, currentPage, entriesPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  const showingFrom =
    filteredRows.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const showingTo = Math.min(currentPage * entriesPerPage, filteredRows.length);

  return (
    <div className="container-fluid mt-4">
      <h2 style={{ color: "#007bff", marginBottom: "1.5rem" }}>
        Downloadable Files
      </h2>

      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <button className="btn btn-primary btn-sm" onClick={openAddModal}>
            Add a new File
          </button>
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div className="d-flex align-items-center">
              <select
                className="form-control form-control-sm mr-2"
                style={{ width: 70 }}
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries per page</span>
            </div>

            <div className="d-flex align-items-center">
              <span className="mr-2">Search:</span>
              <input
                type="text"
                className="form-control form-control-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th>Title</th>
                  <th style={{ width: 180 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-3">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-3 text-muted">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, idx) => (
                    <tr key={row._id}>
                      <td>{(currentPage - 1) * entriesPerPage + idx + 1}</td>
                      <td>{row.title}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm mr-1"
                          onClick={() => handleDownload(row)}
                        >
                          Download
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

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <span>
              Showing {showingFrom} to {showingTo} of {filteredRows.length}{" "}
              entries
            </span>
            <div>
              <button
                className="btn btn-sm btn-outline-secondary mr-1"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                «
              </button>
              <button
                className="btn btn-sm btn-outline-secondary mr-1"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              <button
                className="btn btn-sm btn-outline-secondary mr-1"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
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
        </div>
      </div>

      {/* ===== Add Modal ===== */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a new File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label className="font-weight-bold">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Notice PDF"
            />
          </div>
          <div className="form-group">
            <label className="font-weight-bold">File</label>
            <input
              type="file"
              className="form-control-file"
              onChange={handleFileChange}
            />
          </div>
          <Button
            variant="success"
            className="mt-2"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Add"}
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Page;
