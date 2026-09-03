"use client";
import React, { useState } from "react";
import swal from "sweetalert";
import { generateCertificateAction } from "../../../../lib/downloadCertificate.actions"
import styles from "../../styles/CitizenSection.module.css"; // চাইলে আলাদা css module বানাও

export default function DownloadCertificatePage() {
  const [applicationNo, setApplicationNo] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const base64ToBlob = (base64, contentType = "application/pdf") => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!applicationNo.trim()) {
      swal("Error!", "Please enter your Application No", "error");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      swal("Error!", "Please enter a valid 10-digit mobile number", "error");
      return;
    }

    const fd = new FormData();
    fd.append("application_no", applicationNo.trim());
    fd.append("mobile", mobile.trim());

    setLoading(true);
    try {
      const result = await generateCertificateAction(fd);

      if (!result.success) {
        swal("Error!", result.message || "Failed to generate certificate", "error");
        return;
      }

      const blob = base64ToBlob(result.base64);
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");

      // ব্রাউজার নতুন ট্যাব খুলে নেওয়ার পরে memory থেকে url revoke করা ভালো,
      // কিন্তু ইউজার তখনও নতুন ট্যাবে ফাইল দেখছে, তাই একটু delay দিয়ে revoke করছি
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (err) {
      console.error("Error generating certificate:", err);
      swal("Error!", "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: 480 }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h4 className="mb-3" style={{ color: "#0d2a4d", fontWeight: 700 }}>
            Download Your Certificate
          </h4>
          <p className="text-muted mb-4">
            Enter your Application No and registered Mobile Number to download your certificate.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="font-weight-bold">Application No</label>
              <input
                type="text"
                className="form-control"
                value={applicationNo}
                onChange={(e) => setApplicationNo(e.target.value)}
                placeholder="e.g. B0089397BD"
              />
            </div>
            <div className="form-group">
              <label className="font-weight-bold">Mobile Number</label>
              <input
                type="text"
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block mt-3"
              disabled={loading}
            >
              {loading ? "Generating..." : "Get Certificate"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}