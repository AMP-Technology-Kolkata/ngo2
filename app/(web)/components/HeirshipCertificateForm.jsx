"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import styles from "../styles/HeirshipCertificateForm.module.css";
import { getFormMasterData } from "../../../lib/publicData.actions";

const generateCaptcha = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return captcha;
};

const initialFormData = {
  title: "Shri.",
  name: "",
  mobile: "",
  gender: "",
  dob: "",
  guardian_name: "",
  guardian_type: "",
  address: "",
  village: "",
  post_office: "",
  police_station: "",
  gp: "AMP Panchayet",
  sansad: "",
  district: "",
  state: "",
  religion: "",
  id_type: "",
};

const emptySuccessor = {
  name: "",
  guardian: "",
  relationship: "",
  age: "",
  address: "",
};

export default function HeirshipCertificateForm({ submitHeirship }) {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [successors, setSuccessors] = useState([{ ...emptySuccessor }]);
  const [files, setFiles] = useState({
    document: null,
    tax_receipt: null,
    member_authorization: null,
  });
  const [mobileVerified, setMobileVerified] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [masterData, setMasterData] = useState({
    village: [],
    post_office: [],
    police_station: [],
    sansad: [],
    id_type: [],
  });
  const [masterDataLoading, setMasterDataLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await getFormMasterData();
      if (active) {
        setMasterData(data);
        setMasterDataLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selected } = e.target;
    if (selected?.[0]?.size > 300 * 1024) {
      swal("Error!", "File size must be under 300KB", "error");
      e.target.value = "";
      return;
    }
    setFiles((prev) => ({ ...prev, [name]: selected?.[0] || null }));
  };

  const handleVerifyMobile = () => {
    if (!formData.mobile || formData.mobile.trim().length < 10) {
      swal("Error!", "Enter a valid mobile number first", "error");
      return;
    }
    // TODO: wire actual OTP verification API
    setMobileVerified(true);
    swal("Success!", "Mobile number verified", "success");
  };

  const handleSuccessorChange = (index, field, value) => {
    setSuccessors((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addSuccessor = () => {
    setSuccessors((prev) => [...prev, { ...emptySuccessor }]);
  };

  const removeSuccessor = (index) => {
    setSuccessors((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );
  };

  const validateForm = () => {
    const required = [
      "title",
      "name",
      "mobile",
      "gender",
      "dob",
      "guardian_name",
      "guardian_type",
      "address",
      "village",
      "post_office",
      "police_station",
      "gp",
      "sansad",
      "district",
      "state",
      "religion",
      "id_type",
    ];
    for (const field of required) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        swal(
          "Error!",
          `Please fill the "${field.replace(/_/g, " ")}" field`,
          "error",
        );
        return false;
      }
    }

    const dobDate = new Date(formData.dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dobDate > today) {
      swal("Error!", "Date of Birth cannot be a future date", "error");
      return false;
    }

    const age = today.getFullYear() - dobDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > dobDate.getMonth() ||
      (today.getMonth() === dobDate.getMonth() &&
        today.getDate() >= dobDate.getDate());
    const actualAge = hasHadBirthdayThisYear ? age : age - 1;
    if (actualAge < 18) {
      swal("Error!", "Applicant must be at least 18 years old", "error");
      return false;
    }

    if (!mobileVerified) {
      swal("Error!", "Please verify your mobile number", "error");
      return false;
    }
    for (const s of successors) {
      if (!s.name || !s.guardian || !s.relationship || !s.age || !s.address) {
        swal("Error!", "Please fill all successor details", "error");
        return false;
      }
    }
    if (!files.document || !files.tax_receipt || !files.member_authorization) {
      swal("Error!", "Please upload all required documents", "error");
      return false;
    }
    if (!agree) {
      swal(
        "Error!",
        "Please confirm the details are correct and valid",
        "error",
      );
      return false;
    }
    if (captchaInput.toUpperCase() !== captcha.toUpperCase()) {
      swal("Error!", "Invalid Captcha. Please try again.", "error");
      refreshCaptcha();
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      payload.append(key, value),
    );

    successors.forEach((s) => {
      payload.append("successor_name[]", s.name);
      payload.append("successor_gurdian[]", s.guardian);
      payload.append("successor_relationship[]", s.relationship);
      payload.append("successor_age[]", s.age);
      payload.append("successor_address[]", s.address);
    });

    payload.append("document", files.document);
    payload.append("tax_receipt", files.tax_receipt);
    payload.append("member_authorization", files.member_authorization);

    setSubmitting(true);
    const result = await submitHeirship(payload);

    if (result.success) {
      swal("Success!", "Application submitted successfully!", "success");
      setFormData(initialFormData);
      setSuccessors([{ ...emptySuccessor }]);
      setFiles({
        document: null,
        tax_receipt: null,
        member_authorization: null,
      });
      setMobileVerified(false);
      setAgree(false);
      refreshCaptcha();
      if (result.data?.applicationId) {
        router.push(`/check-status?id=${result.data.applicationId}`);
      }
    } else {
      swal(
        "Error!",
        result.message || "Submission failed. Please try again.",
        "error",
      );
    }
    setSubmitting(false);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSuccessors([{ ...emptySuccessor }]);
    setFiles({ document: null, tax_receipt: null, member_authorization: null });
    setMobileVerified(false);
    setAgree(false);
    refreshCaptcha();
  };

  return (
    <>
      <Head>
        <title>Apply for Heirship Certificate</title>
      </Head>
      <div className={styles.wrapper}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Apply for Heirship Certificate</h2>
          <p className={styles.subtitle}>
            Please fill the form with correct details.
          </p>
          <button type="button" className={styles.guidelinesBtn}>
            Show Guidelines
          </button>

          <div className={styles.divider} />

          {/* Applicant details */}
          <div className={styles.grid4}>
            <div className={styles.field}>
              <label>Title *</label>
              <select name="title" value={formData.title} onChange={handleChange}>
                <option value="Shri.">Shri.</option>
                <option value="Shrimati">Shrimati</option>
                <option value="Kumari">Kumari</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Name of the Applicant *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className={styles.field}>
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Choose Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.grid4}>
            <div className={styles.field}>
              <label>Mobile *</label>
              <div className={styles.inlineInput}>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={mobileVerified}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" placeholder="Enter Email Address" />
            </div>
            <div className={styles.field}>
              <label>Name of the Guardian *</label>
              <input
                type="text"
                name="guardian_name"
                placeholder="Enter Guardian's Full Name"
                value={formData.guardian_name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Relation with the Applicant *</label>
              <select
                name="guardian_type"
                value={formData.guardian_type}
                onChange={handleChange}
              >
                <option value="">Choose appropriate relation</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="husband">Husband</option>
                <option value="wife">Wife</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            className={styles.verifyBtn}
            onClick={handleVerifyMobile}
          >
            {mobileVerified ? "Verified ✓" : "Verify"}
          </button>

          <div className={styles.grid1}>
            <div className={styles.field}>
              <label>Religion *</label>
              <select name="religion" value={formData.religion} onChange={handleChange}>
                <option value="">Choose Religion</option>
                <option value="hindu">Hindu</option>
                <option value="muslim">Muslim</option>
                <option value="christian">Christian</option>
                <option value="sikh">Sikh</option>
                <option value="buddhist">Buddhist</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Address section */}
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Street Name</label>
              <input
                type="text"
                name="address"
                placeholder="1234 Main St"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Village *</label>
              <select
                name="village"
                value={formData.village}
                onChange={handleChange}
                disabled={masterDataLoading}
              >
                <option value="">
                  {masterDataLoading ? "Loading..." : "Choose Village"}
                </option>
                {masterData.village.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.grid4}>
            <div className={styles.field}>
              <label>Post Office *</label>
              <select
                name="post_office"
                value={formData.post_office}
                onChange={handleChange}
                disabled={masterDataLoading}
              >
                <option value="">
                  {masterDataLoading ? "Loading..." : "Choose Post Office"}
                </option>
                {masterData.post_office.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Police Station *</label>
              <select
                name="police_station"
                value={formData.police_station}
                onChange={handleChange}
                disabled={masterDataLoading}
              >
                <option value="">
                  {masterDataLoading ? "Loading..." : "Choose Police Station"}
                </option>
                {masterData.police_station.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Gram Panchayet *</label>
              <input type="text" name="gp" value={formData.gp} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Sansad *</label>
              <select
                name="sansad"
                value={formData.sansad}
                onChange={handleChange}
                disabled={masterDataLoading}
              >
                <option value="">
                  {masterDataLoading ? "Loading..." : "Choose Sansad"}
                </option>
                {masterData.sansad.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.grid4}>
            <div className={styles.field}>
              <label>District *</label>
              <input
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>State *</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>ID Type *</label>
              <select
                name="id_type"
                value={formData.id_type}
                onChange={handleChange}
                disabled={masterDataLoading}
              >
                <option value="">
                  {masterDataLoading ? "Loading..." : "Choose Document"}
                </option>
                {masterData.id_type.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Upload Document (upto 300KB) *</label>
              <input type="file" name="document" onChange={handleFileChange} />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Current Tax Receipt (upto 300KB) *</label>
              <input type="file" name="tax_receipt" onChange={handleFileChange} />
            </div>
            <div className={styles.field}>
              <label>Member Authorization *</label>
              <input
                type="file"
                name="member_authorization"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className={styles.divider} />

          {/* Successor details */}
          <h3 className={styles.sectionTitle}>Successor Details</h3>
          {successors.map((s, index) => (
            <div className={styles.successorRow} key={index}>
              <input
                type="text"
                placeholder="Name"
                value={s.name}
                onChange={(e) => handleSuccessorChange(index, "name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Father/Husband Name"
                value={s.guardian}
                onChange={(e) =>
                  handleSuccessorChange(index, "guardian", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Relationship with Deceased"
                value={s.relationship}
                onChange={(e) =>
                  handleSuccessorChange(index, "relationship", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Age"
                value={s.age}
                onChange={(e) => handleSuccessorChange(index, "age", e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                value={s.address}
                onChange={(e) =>
                  handleSuccessorChange(index, "address", e.target.value)
                }
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeSuccessor(index)}
              >
                −
              </button>
            </div>
          ))}
          <button type="button" className={styles.addBtn} onClick={addSuccessor}>
            + Add New
          </button>

          <div className={styles.divider} />

          {/* Captcha */}
          <div className={styles.captchaSection}>
            <div className={styles.captchaPreview}>{captcha}</div>
            <button type="button" className={styles.refreshBtn} onClick={refreshCaptcha}>
              ↻
            </button>
            <input
              type="text"
              placeholder="Please Enter the Code"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
            />
          </div>

          <label className={styles.confirmLabel}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            I confirm that all the above details are correct and valid. *
          </label>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <button type="button" className={styles.resetBtn} onClick={handleReset}>
              Reset
            </button>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => router.push("/citizen-services")}
            >
              ← Back
            </button>
          </div>
        </form>
      </div>
    </>
  );
}