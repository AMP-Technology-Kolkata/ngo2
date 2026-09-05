"use client";
import React, { useState, useEffect } from "react";
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
  issued_by: "",
  mobile: "",
  memo_no: "",
  memo_date: "",
  certificate_type: "Burning",
  deceased_name: "",
  gender: "",
  relation_with: "",
  relation_with_name: "",
  resident_type: "PERMANENT_RESIDENT",
  owner_name: "",
  died_on: "",
  burnt_buried_on: "",
  place: "",
  sansad: "",
  village: "",
  post_office: "",
  mouza: "",
  pin_code: "",
  issued_to: "",
  relation_with_deceased: "",
};

export default function BurningForm({ submitBurning }) {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [masterData, setMasterData] = useState({
    village: [],
    post_office: [],
    sansad: [],
    mouza: [],
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

  const handleVerifyMobile = () => {
    if (!formData.mobile || formData.mobile.trim().length < 10) {
      swal("Error!", "Enter a valid mobile number first", "error");
      return;
    }
    setMobileVerified(true);
    swal("Success!", "Mobile number verified", "success");
  };

  const validateForm = () => {
    const required = [
      "mobile",
      "memo_no",
      "memo_date",
      "certificate_type",
      "deceased_name",
      "gender",
      "relation_with",
      "relation_with_name",
      "resident_type",
      "died_on",
      "burnt_buried_on",
      "sansad",
      "village",
      "post_office",
      "mouza",
      "pin_code",
      "issued_to",
      "relation_with_deceased",
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
    if (formData.resident_type === "TENANT" && !formData.owner_name.trim()) {
      swal("Error!", "Owner Name is required for tenants", "error");
      return false;
    }
    if (!mobileVerified) {
      swal("Error!", "Please verify your mobile number", "error");
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

    setSubmitting(true);
    const result = await submitBurning(formData); // plain JS object, FormData na

    if (result.success) {
      swal("Success!", "Application submitted successfully!", "success");
      setFormData(initialFormData);
      setMobileVerified(false);
      setAgree(false);
      refreshCaptcha();
      if (result.data?.application_no) {
        router.push(
          `/citizen-services/check-status?id=${result.data.application_no}`,
        );
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
    setMobileVerified(false);
    setAgree(false);
    refreshCaptcha();
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Apply for Burning / Burial Certificate</h2>
        <p className={styles.subtitle}>
          Please fill the form with correct details.
        </p>

        <div className={styles.divider} />

        <div className={styles.grid4}>
          <div className={styles.field}>
            <label>Mobile No *</label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter Mobile No"
              value={formData.mobile}
              onChange={handleChange}
              disabled={mobileVerified}
            />
          </div>
          <div className={styles.field}>
            <label>Memo No *</label>
            <input
              type="text"
              name="memo_no"
              placeholder="Enter Memo No"
              value={formData.memo_no}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Memo Date *</label>
            <input
              type="date"
              name="memo_date"
              value={formData.memo_date}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Certificate Type *</label>
            <select
              name="certificate_type"
              value={formData.certificate_type}
              onChange={handleChange}
            >
              <option value="Burning">Burning</option>
              <option value="Burial">Burial</option>
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

        <div className={styles.grid4}>
          <div className={styles.field}>
            <label>Deceased Name *</label>
            <input
              type="text"
              name="deceased_name"
              placeholder="Enter Name"
              value={formData.deceased_name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Relation With *</label>
            <select
              name="relation_with"
              value={formData.relation_with}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="husband">Husband</option>
              <option value="wife">Wife</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Relation With Name *</label>
            <input
              type="text"
              name="relation_with_name"
              placeholder="Enter Relation With Name"
              value={formData.relation_with_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.grid4}>
          <div className={styles.field}>
            <label>Resident Type *</label>
            <select
              name="resident_type"
              value={formData.resident_type}
              onChange={handleChange}
            >
              <option value="PERMANENT_RESIDENT">Permanent Resident</option>
              <option value="TENANT">Tenant</option>
            </select>
          </div>
          {formData.resident_type === "TENANT" && (
            <div className={styles.field}>
              <label>Owner Name (If Tenant) *</label>
              <input
                type="text"
                name="owner_name"
                placeholder="Enter Owner Name"
                value={formData.owner_name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className={styles.field}>
            <label>Died On *</label>
            <input
              type="date"
              name="died_on"
              value={formData.died_on}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Burnt/Buried On *</label>
            <input
              type="date"
              name="burnt_buried_on"
              value={formData.burnt_buried_on}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.grid4}>
          <div className={styles.field}>
            <label>Place</label>
            <input
              type="text"
              name="place"
              placeholder="Enter Place"
              value={formData.place}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Sansad Name *</label>
            <select
              name="sansad"
              value={formData.sansad}
              onChange={handleChange}
              disabled={masterDataLoading}
            >
              <option value="">
                {masterDataLoading ? "Loading..." : "-- Select --"}
              </option>
              {masterData.sansad.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
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
                {masterDataLoading ? "Loading..." : "-- Select --"}
              </option>
              {masterData.village.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Post Office *</label>
            <select
              name="post_office"
              value={formData.post_office}
              onChange={handleChange}
              disabled={masterDataLoading}
            >
              <option value="">
                {masterDataLoading ? "Loading..." : "-- Select --"}
              </option>
              {masterData.post_office.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.grid4}>
          <div className={styles.field}>
            <label>Mouza *</label>
            <select
              name="mouza"
              value={formData.mouza}
              onChange={handleChange}
              disabled={masterDataLoading}
            >
              <option value="">
                {masterDataLoading ? "Loading..." : "-- Select --"}
              </option>
              {masterData.mouza.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Pin Code *</label>
            <input
              type="text"
              name="pin_code"
              placeholder="Enter Pin Code"
              value={formData.pin_code}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Issued To *</label>
            <input
              type="text"
              name="issued_to"
              placeholder="Enter Issued To"
              value={formData.issued_to}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Relation with Deceased *</label>
            <select
              name="relation_with_deceased"
              value={formData.relation_with_deceased}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Wife">Wife</option>
              <option value="Husband">Husband</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.captchaSection}>
          <div className={styles.captchaPreview}>{captcha}</div>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={refreshCaptcha}
          >
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
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleReset}
          >
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
  );
}
