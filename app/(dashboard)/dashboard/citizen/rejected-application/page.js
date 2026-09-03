"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";
import { FaEye } from "react-icons/fa";
import { getFormMasterData } from "../../../../../lib/publicData.actions";

const BACKLINK = process.env.NEXT_PUBLIC_BACKLINK;
const API_BASE = `${BACKLINK}/dashboard/application`;

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function Page() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [lookup, setLookup] = useState({ sansad: {} });

  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    fetchLookupData();
    fetchApplications();
  }, []);

  const fetchLookupData = async () => {
    try {
      const data = await getFormMasterData();
      const toMap = (arr) =>
        (arr || []).reduce((acc, item) => {
          acc[item._id] = item.name;
          return acc;
        }, {});
      setLookup({ sansad: toMap(data.sansad) });
    } catch (err) {
      console.error("Error fetching lookup data:", err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/applicationnew`, {
        params: { status: "rejected" },
        withCredentials: true,
      });
      setApplications(res.data.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching rejected applications:", err);
      setError("Error fetching rejected applications");
    } finally {
      setLoading(false);
    }
  };

  const getLabel = (type, value) => {
    if (!value) return "-";
    if (typeof value === "object") return value.name || "-";
    return lookup[type]?.[value] || value;
  };

  const handleView = async (app) => {
    setShowViewModal(true);
    setViewLoading(true);
    setViewData(null);
    try {
      const res = await axios.get(`${API_BASE}/view/${app.application_no}`, {
        withCredentials: true,
      });
      setViewData(res.data.data);
    } catch (err) {
      console.error("Error fetching application detail:", err);
      swal("Error!", "Failed to load application details", "error");
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((app) =>
      [
        app.application_no,
        app.name,
        app.mobile,
        app.application_type,
        getLabel("sansad", app.sansad),
        app.remarks,
      ]
        .filter(Boolean)
        .some((val) => val.toString().toLowerCase().includes(q)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications, search, lookup]);

  const totalEntries = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const pageStart = (currentPage - 1) * entriesPerPage;
  const paginated = filtered.slice(pageStart, pageStart + entriesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  return (
    <div className="container-fluid mt-4">
      <h2 style={{ color: "#007bff", marginBottom: "1.5rem" }}>View Rejected Applications</h2>

      {error && <div className="alert alert-danger">{error}</div>}

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
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover bg-white">
          <thead className="thead-light">
            <tr>
              <th>Application No</th>
              <th>Type</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Sansad</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4">Loading...</td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">No rejected applications found.</td>
              </tr>
            ) : (
              paginated.map((app) => (
                <tr key={app._id}>
                  <td>{app.application_no}</td>
                  <td>
                    <span className="badge badge-info text-capitalize">
                      {app.application_type}
                    </span>
                  </td>
                  <td>{app.name}</td>
                  <td>{app.mobile}</td>
                  <td>{getLabel("sansad", app.sansad)}</td>
                  <td>
                    <span className="badge badge-danger">{app.status}</span>
                  </td>
                  <td>{app.remarks || "-"}</td>
                  <td>{formatDate(app.updatedAt)}</td>
                  <td>
                    <FaEye
                      title="View"
                      style={{ color: "#007bff", cursor: "pointer" }}
                      onClick={() => handleView(app)}
                    />
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
          {Math.min(pageStart + entriesPerPage, totalEntries)} of {totalEntries} entries
        </span>
        <div className="d-flex" style={{ gap: "4px" }}>
          <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>‹</button>
          <button className="btn btn-sm btn-primary" disabled>{currentPage}</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>›</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
        </div>
      </div>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : viewData ? (
            <div className="row">
              {Object.entries(viewData)
                .filter(([key]) => !["__v", "_id", "office"].includes(key))
                .map(([key, value]) => {
                  let display = value;
                  if (value === null || value === undefined || value === "") {
                    display = "-";
                  } else if (key === "sansad") {
                    display = getLabel("sansad", value);
                  } else if (typeof value === "object" && !Array.isArray(value)) {
                    display = value.name || "-";
                  } else if (Array.isArray(value)) {
                    display = `${value.length} item(s)`;
                  } else if (["id_file", "tax_receipt", "member_authorization"].includes(key)) {
                    display = null;
                  } else {
                    display = value.toString();
                  }
                  return (
                    <div className="col-md-6 mb-2" key={key}>
                      <strong>{key.replace(/_/g, " ")}: </strong>
                      {display === null ? (
                        <a href={value} target="_blank" rel="noreferrer">View File</a>
                      ) : (
                        <span>{display}</span>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-4">No data</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Page;