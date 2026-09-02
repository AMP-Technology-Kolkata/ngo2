"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import { FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { getFormMasterData } from "../../../../../lib/publicData.actions";

const BACKLINK = process.env.NEXT_PUBLIC_BACKLINK; // e.g. http://localhost:8001/api
// Route mount in app.js: app.use("/api/dashboard/application", verifyJWT, applicationAdminRouter)
// So base here = BACKLINK + "/dashboard/application"
const API_BASE = `${BACKLINK}/dashboard/application`;

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Page() {
  const router = useRouter();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ID -> Name maps for village/post_office/police_station/sansad/id_type
  const [lookup, setLookup] = useState({
    village: {},
    post_office: {},
    police_station: {},
    sansad: {},
    id_type: {},
  });

  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  // View modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [rejecting, setRejecting] = useState(false);

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
      setLookup({
        village: toMap(data.village),
        post_office: toMap(data.post_office),
        police_station: toMap(data.police_station),
        sansad: toMap(data.sansad),
        id_type: toMap(data.id_type),
      });
    } catch (err) {
      console.error("Error fetching lookup data:", err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/applicationnew`, {
        withCredentials: true,
      });
      setApplications(res.data.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Error fetching applications");
    } finally {
      setLoading(false);
    }
  };

  // Resolve an ID field to a readable name using lookup maps; falls back to
  // populated-object shape or raw value if map miss
  const getLabel = (type, value) => {
    if (!value) return "-";
    if (typeof value === "object") return value.name || "-";
    return lookup[type]?.[value] || value;
  };

  // ---------- View ----------
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

  // ---------- Approve (no dedicated API given — routes to processing/certificate page) ----------
  const handleApprove = (app) => {
    router.push(`/dashboard/citizen/certificate/${app.application_no}`);
  };

  // ---------- Reject ----------
  const handleOpenReject = (app) => {
    setSelectedApp(app);
    setRemarks("");
    setShowRejectModal(true);
  };

  const handleCancelReject = () => {
    setShowRejectModal(false);
    setSelectedApp(null);
    setRemarks("");
  };

  const handleSaveReject = async () => {
    if (!remarks.trim()) {
      swal("Error!", "Please enter remarks", "error");
      return;
    }
    setRejecting(true);
    try {
      await axios.post(
        `${API_BASE}/application/reject`,
        { application_no: selectedApp.application_no, remarks },
        { withCredentials: true },
      );
      setShowRejectModal(false);
      setSelectedApp(null);
      setRemarks("");
      swal("Rejected!", "Application has been rejected.", "success");
      fetchApplications();
    } catch (err) {
      console.error("Error rejecting application:", err);
      swal("Error!", "Failed to reject application", "error");
    } finally {
      setRejecting(false);
    }
  };

  // ---------- Search + Sort + Paginate (client-side) ----------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = applications.filter((app) => app.status === "pending");
    if (q) {
      list = list.filter((app) =>
        [
          app.application_no,
          app.name,
          app.mobile,
          app.application_type,
          getLabel("sansad", app.sansad),
          app.status,
        ]
          .filter(Boolean)
          .some((val) => val.toString().toLowerCase().includes(q)),
      );
    }
    const sorted = [...list].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === "sansad") {
        valA = getLabel("sansad", a.sansad);
        valB = getLabel("sansad", b.sansad);
      }
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (sortField === "createdAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications, search, sortField, sortDir, lookup]);

  const totalEntries = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const pageStart = (currentPage - 1) * entriesPerPage;
  const paginated = filtered.slice(pageStart, pageStart + entriesPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortArrow = (field) =>
    sortField === field ? (sortDir === "asc" ? " ▲" : " ▼") : " ⇅";

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  return (
    <div className="container-fluid mt-4">
      <h2 style={{ color: "#007bff", marginBottom: "1.5rem" }}>
        Manage New Application
      </h2>

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
            placeholder="Search application..."
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
              <th>Village</th>
              <th>Post Office</th>
              <th>Police Station</th>
              <th>GP</th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => toggleSort("sansad")}
              >
                Sansad{sortArrow("sansad")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => toggleSort("status")}
              >
                Status{sortArrow("status")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => toggleSort("createdAt")}
              >
                Date{sortArrow("createdAt")}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-4">
                  No pending applications found.
                </td>
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
                  <td>{getLabel("village", app.village)}</td>
                  <td>{getLabel("post_office", app.post_office)}</td>
                  <td>{getLabel("police_station", app.police_station)}</td>
                  <td>{app.gp || "-"}</td>
                  <td>{getLabel("sansad", app.sansad)}</td>
                  <td>
                    <span
                      className={`badge ${
                        app.status === "pending"
                          ? "badge-warning"
                          : app.status === "completed"
                            ? "badge-success"
                            : "badge-danger"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <FaEye
                        title="View"
                        style={{ color: "#007bff", cursor: "pointer" }}
                        onClick={() => handleView(app)}
                      />
                      <FaCheckCircle
                        title="Approve / Process"
                        style={{ color: "#28a745", cursor: "pointer" }}
                        onClick={() => handleApprove(app)}
                      />
                      <FaTimesCircle
                        title="Reject"
                        style={{ color: "#dc3545", cursor: "pointer" }}
                        onClick={() => handleOpenReject(app)}
                      />
                    </div>
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
          {Math.min(pageStart + entriesPerPage, totalEntries)} of {totalEntries}{" "}
          entries
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

      {/* ===== View Modal ===== */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
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
                  } else if (
                    [
                      "village",
                      "post_office",
                      "police_station",
                      "sansad",
                      "id_type",
                    ].includes(key)
                  ) {
                    display = getLabel(key, value);
                  } else if (
                    typeof value === "object" &&
                    !Array.isArray(value)
                  ) {
                    display = value.name || "-";
                  } else if (Array.isArray(value)) {
                    display = `${value.length} item(s)`;
                  } else if (
                    key === "id_file" ||
                    key === "tax_receipt" ||
                    key === "member_authorization"
                  ) {
                    display = null; // rendered as link below
                  } else {
                    display = value.toString();
                  }
                  return (
                    <div className="col-md-6 mb-2" key={key}>
                      <strong>{key.replace(/_/g, " ")}: </strong>
                      {display === null ? (
                        <a href={value} target="_blank" rel="noreferrer">
                          View File
                        </a>
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
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===== Reject Modal ===== */}
      <Modal show={showRejectModal} onHide={handleCancelReject} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label className="font-weight-bold">Application No</label>
            <input
              type="text"
              className="form-control"
              value={selectedApp?.application_no || ""}
              disabled
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="font-weight-bold">Remarks</label>
            <textarea
              className="form-control"
              rows={6}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter rejection reason..."
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={handleSaveReject}
            disabled={rejecting}
          >
            {rejecting ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Page;