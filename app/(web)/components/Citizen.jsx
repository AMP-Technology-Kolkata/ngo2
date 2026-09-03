"use client";
import Link from "next/link";
import styles from "../styles/CitizenSection.module.css";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";
import { FaDownload } from "react-icons/fa";

// static services list — update title/link as needed
const SERVICES = [
  {
    title: "Character Certificate",
    link: "/citizen-services/character-certificate",
    color: "blue",
    icon: "shield",
  },
  {
    title: "Residential Certificate",
    link: "/citizen-services/residential-certificate",
    color: "green",
    icon: "globe",
  },
  {
    title: "Income Certificate",
    link: "/citizen-services/income-certificate",
    color: "cyan",
    icon: "shield",
  },
  {
    title: "Unemployment Certificate",
    link: "/citizen-services/unemployment-certificate",
    color: "indigo",
    icon: "boxes",
  },
  {
    title: "Caste Certificate",
    link: "/citizen-services/caste-certificate",
    color: "blue",
    icon: "shield",
  },
  {
    title: "Unmarried Certificate",
    link: "/citizen-services/unmarried-certificate",
    color: "green",
    icon: "globe",
  },
  {
    title: "BPL Certificate",
    link: "/citizen-services/bpl-certificate",
    color: "cyan",
    icon: "shield",
  },
  {
    title: "JSY Certificate",
    link: "/citizen-services/jsy-certificate",
    color: "indigo",
    icon: "boxes",
  },
  {
    title: "Heirship Certificate",
    link: "/citizen-services/heirship-certificate",
    color: "blue",
    icon: "boxes",
  },
];

function ShieldIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z"
        stroke="#fff"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function BoxesIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L4 6.5v11L12 22l8-4.5v-11L12 2z"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M4 6.5L12 11l8-4.5M12 11v11" stroke="#fff" strokeWidth="1.6" />
    </svg>
  );
}

const ICONS = {
  shield: ShieldIcon,
  globe: GlobeIcon,
  boxes: BoxesIcon,
};

export default function CitizenSection() {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  // ---------- Download Certificate modal state ----------
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [applicationNo, setApplicationNo] = useState("");
  const [mobile, setMobile] = useState("");
  const [checking, setChecking] = useState(false);

  const openDownloadModal = () => {
    setApplicationNo("");
    setMobile("");
    setShowDownloadModal(true);
  };

  const closeDownloadModal = () => {
    setShowDownloadModal(false);
    setApplicationNo("");
    setMobile("");
  };

  const handleDownloadCertificate = async () => {
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

    setChecking(true);
    try {
      const result = await downloadCertificateAction(fd);
      if (!result.success) {
        swal(
          "Error!",
          result.message || "Failed to fetch certificate",
          "error",
        );
        return;
      }
      swal("Found!", "Your certificate is ready. Opening now...", "success");
      window.open(result.data.certificate_file, "_blank");
      closeDownloadModal();
    } catch (err) {
      console.error("Error downloading certificate:", err);
      swal("Error!", "Something went wrong. Please try again.", "error");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div ref={ref} className={styles.servicesWrapper} id="services">
      <div className="container">
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Our Services
        </motion.h2>

        <div className={styles.grid}>
          {SERVICES.map((service, index) => {
            const IconComponent = ICONS[service.icon];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={
                  inView
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 40, scale: 0.9 }
                }
                transition={{
                  delay: index * 0.08,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                <Link
                  href={service.link}
                  className={`${styles.card} ${styles[service.color]}`}
                >
                  <span className={styles.icon}>
                    <IconComponent />
                  </span>
                  <span className={styles.title}>{service.title}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ===== Download Certificate section ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="text-center mt-5"
          style={{
            background: "#0d2a4d",
            borderRadius: "14px",
            padding: "32px 20px",
          }}
        >
          <h4 style={{ color: "#fff", marginBottom: "8px" }}>
            Already Applied?
          </h4>
          <p style={{ color: "#cfd8e3", marginBottom: "20px" }}>
            Download your certificate using your Application No and Mobile
            Number.
          </p>
          <Link
            href="/citizen-services/download-certificate"
            className="btn btn-light font-weight-bold"
            style={{ padding: "10px 28px", borderRadius: "8px" }}
          >
            <FaDownload style={{ marginRight: 8 }} />
            Download Certificate
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
