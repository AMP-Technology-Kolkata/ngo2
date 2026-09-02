"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";

const BACKLINK = process.env.NEXT_PUBLIC_BACKLINK;
const BACKPUBLIC = process.env.NEXT_PUBLIC_BACKPUBLIC; // for rendering image src
const API_BASE = `${BACKLINK}/dashboard/application`;

// TODO: confirm full signatory list with backend/PM
const PERSON_TYPES = ["Pradhan", "Secretary"];

// signature.image is stored as raw multer req.file.path (e.g. "uploads/signatures/xyz.png")
// Requires backend to serve that folder statically, e.g. app.use("/uploads", express.static("uploads"))
const buildSignatureUrl = (imagePath) => {
  if (!imagePath) return null;
  const clean = imagePath.replace(/\\/g, "/").replace(/^\/?/, "");
  return `${BACKPUBLIC}/${clean}`;
};

function Page() {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDir, setSortDir] = useState("asc");

  // Edit modal (no add/delete — updateSignature is an upsert keyed by `person`)
  const [showModal, setShowModal] = useState(false);
  const [formPerson, setFormPerson] = useState(PERSON_TYPES[0]);
  const [formFile, setFormFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSignatures();
  }, []);

  const fetchSignatures = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/signatures`, {
        withCredentials: true,
      });
      setSignatures(res.data.data || []);
    } catch (err) {
      console.error("Error fetching signatures:", err);
      swal("Error!", "Failed to load signatures", "error");
    } finally {
      setLoading(false);
    }
  };

  // Merge PERSON_TYPES with whatever signatures already exist, so every
  // person shows a row even before their first signature is uploaded.
  const rows = useMemo(() => {
    const byPerson = signatures.reduce((acc, s) => {
      acc[s.person] = s;
      return acc;
    }, {});
    return PERSON_TYPES.map((person) => byPerson[person] || { person, image: null });
  }, [signatures]);

  // ---------- Edit ----------
  const openEditModal = (row) => {
    setFormPerson(row.person);
    setFormFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormFile(null);
  };

  const handleSave = async () => {
    if (!formFile) {
      swal("Error!", "Please choose a signature image", "error");
      return;
    }

    const payload = new FormData();
    payload.append("person", formPerson);
    payload.append("signature", formFile);

    setSaving(true);
    try {
      await axios.post(`${API_BASE}/signatures/update`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      swal("Updated!", "Signature updated successfully.", "success");
      closeModal();
      fetchSignatures();
    } catch (err) {
      console.error("Error saving signature:", err);
      swal(
        "Error!",
        err.response?.data?.message || "Failed to save signature",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------- Search + Sort + Paginate ----------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...rows];
    if (q) {
      list = list.filter((r) => r.person.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const valA = a.person.toLowerCase();
      const valB = b.person.toLowerCase();
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [rows, search, sortDir]);

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
        Manage Signatures
      </h2>

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
            placeholder="Search signatures..."
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover bg-white">
          <thead className="thead-light">
            <tr>
              <th style={{ cursor: "pointer" }} onClick={toggleSort}>
                Person {sortDir === "asc" ? "▲" : "▼"}
              </th>
              <th>Signature</th>
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
                  No signatures found.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.person}>
                  <td className="text-capitalize">{row.person}</td>
                  <td>
                    {row.image ? (
                      <img
                        src={buildSignatureUrl(row.image)}
                        alt={`${row.person} signature`}
                        style={{ height: 40, objectFit: "contain" }}
                      />
                    ) : (
                      <span className="text-muted">No signature</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openEditModal(row)}
                    >
                      Edit
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

      {/* ===== Edit Modal ===== */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Signature for {formPerson}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label className="font-weight-bold">Person</label>
            <input
              type="text"
              className="form-control"
              value={formPerson}
              disabled
            />
          </div>
          <div className="form-group">
            <label className="font-weight-bold">Signature</label>
            <input
              type="file"
              accept="image/*"
              className="form-control-file"
              onChange={(e) => setFormFile(e.target.files?.[0] || null)}
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