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

const LAND_TYPES = ["Agricultural", "Residential", "Commercial", "Industrial", "Others"];

const initialFormData = {
  mobile: "",
  sl_no: "",
  date: "",
  dag_no: "",
  khatian_no: "",
  jl_no: "",
  mouza: "",
  land_area: "",
  chatak: "",
  sq_feet: "",
  ward_sansad: "",
  post_office: "",
  village: "",
  owner_name: "",
  relation_with: "",
  relation_with_name: "",
  from_land_type: "",
  to_land_type: "",
  land_used_as: "",
};

export default function LandNocForm({ submitLandNoc }) {
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
    // TODO: wire actual OTP verification API
    setMobileVerified(true);
    swal("Success!", "Mobile number verified", "success");
  };

  const validateForm = () => {
    const required = [
      "mobile",
      "date",
      "dag_no",
      "khatian_no",
      "jl_no",
      "mouza",
      "land_area",
      "ward_sansad",
      "post_office",
      "village",
      "owner_name",
      "relation_with",
      "relation_with_name",
      "from_land_type",
      "to_land_type",
      "land_used_as",
    ];
    for (const field of required) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        swal("Error!", `Please fill the "${field.replace(/_/g, " ")}" field`, "error");
        return false;
      }
    }
    if (!mobileVerified) {
      swal("Error!", "Please verify your mobile number", "error");
      return false;
    }
    if (!agree) {
      swal("Error!", "Please confirm the details are correct and valid", "error");
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
  const result = await submitLandNoc(formData); // plain JS object, FormData na

  if (result.success) {
    swal("Success!", "Application submitted successfully!", "success");
    setFormData(initialFormData);
    setMobileVerified(false);
    setAgree(false);
    refreshCaptcha();
    if (result.data?.application_no) {
      router.push(`/citizen-services/check-status?id=${result.data.application_no}`);
    }
  } else {
    swal("Error!", result.message || "Submission failed. Please try again.", "error");
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
        <h2 className={styles.title}>Apply for Land NOC</h2>
        <p className={styles.subtitle}>Please fill the form with correct details.</p>

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
            <label>Sl No</label>
            <input type="text" name="sl_no" placeholder="Enter Sl No" value={formData.sl_no} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Date *</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Dag No *</label>
            <input type="text" name="dag_no" placeholder="Enter Dag No" value={formData.dag_no} onChange={handleChange} />
          </div>
        </div>

        <button type="button" className={styles.verifyBtn} onClick={handleVerifyMobile}>
          {mobileVerified ? "Verified ✓" : "Verify"}
        </button>

        <div className={styles.grid4}>
          <div className={styles.field}>
            <label>Khatian No *</label>
            <input type="text" name="khatian_no" placeholder="Enter Khatian No" value={formData.khatian_no} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>JL No *</label>
            <input type="text" name="jl_no" placeholder="Enter JL No" value={formData.jl_no} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Mouza *</label>
            <select name="mouza" value={formData.mouza} onChange={handleChange} disabled={masterDataLoading}>
              <option value="">{masterDataLoading ? "Loading..." : "-- Select --"}</option>
              {masterData?.mouza?.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Land Area (In Acre/Katha) *</label>
            <input type="text" name="land_area" placeholder="Enter Land Area" value={formData.land_area} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.grid4}>
          <div className={styles.field}>
            <label>Chatak</label>
            <input type="text" name="chatak" placeholder="Enter Chatak" value={formData.chatak} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Sq Feet</label>
            <input type="text" name="sq_feet" placeholder="Enter Sq Feet" value={formData.sq_feet} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Ward/Sansad *</label>
            <select name="ward_sansad" value={formData.ward_sansad} onChange={handleChange} disabled={masterDataLoading}>
              <option value="">{masterDataLoading ? "Loading..." : "-- Select --"}</option>
              {masterData.sansad.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Post Office *</label>
            <select name="post_office" value={formData.post_office} onChange={handleChange} disabled={masterDataLoading}>
              <option value="">{masterDataLoading ? "Loading..." : "-- Select --"}</option>
              {masterData.post_office.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.grid4}>
          <div className={styles.field}>
            <label>Owner Name *</label>
            <input type="text" name="owner_name" placeholder="Enter Owner Name" value={formData.owner_name} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Relation With *</label>
            <select name="relation_with" value={formData.relation_with} onChange={handleChange}>
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
            <input type="text" name="relation_with_name" placeholder="Enter Relation With Name" value={formData.relation_with_name} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Village *</label>
            <select name="village" value={formData.village} onChange={handleChange} disabled={masterDataLoading}>
              <option value="">{masterDataLoading ? "Loading..." : "-- Select --"}</option>
              {masterData.village.map((v) => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.grid4}>
          <div className={styles.field}>
            <label>From Land Type *</label>
            <select name="from_land_type" value={formData.from_land_type} onChange={handleChange}>
              <option value="">-- Select --</option>
              {LAND_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label>To Land Type *</label>
            <select name="to_land_type" value={formData.to_land_type} onChange={handleChange}>
              <option value="">-- Select --</option>
              {LAND_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label>Land Used As *</label>
            <input type="text" name="land_used_as" placeholder="Enter Land Used As" value={formData.land_used_as} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.captchaSection}>
          <div className={styles.captchaPreview}>{captcha}</div>
          <button type="button" className={styles.refreshBtn} onClick={refreshCaptcha}>↻</button>
          <input type="text" placeholder="Please Enter the Code" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} />
        </div>

        <label className={styles.confirmLabel}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          I confirm that all the above details are correct and valid. *
        </label>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button type="button" className={styles.resetBtn} onClick={handleReset}>Reset</button>
          <button type="button" className={styles.resetBtn} onClick={() => router.push("/citizen-services")}>← Back</button>
        </div>
      </form>
    </div>
  );
}