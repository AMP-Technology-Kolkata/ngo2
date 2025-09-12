"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

function Page() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    landmark: "",
    whatsapp: "",
    mobile: "",
    logo: null,
    logo_alt: null,
    notification_bg_iamge: null,
    activity_bg_iamge: null,
    banner: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileError, setMobileError] = useState("");
  const [logoError, setLogoError] = useState("");
  const [bannerError, setBannerError] = useState("");

  const validateMobile = (mobile) => {
    const regex = /^\d{10}$/;
    return regex.test(mobile);
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/office/list`,
        { withCredentials: true }
      );
      setFormData(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const isValidMobile = validateMobile(value.trim());
      setMobileError(isValidMobile ? "" : "Mobile number must be 10 digits");
    }

    if (
      name === "logo" ||
      name === "banner" ||
      name === "logo_alt" ||
      name === "notification_bg_iamge" ||
      name === "activity_bg_iamge"
    ) {
      const file = e.target.files[0];
      if (file) {
        const fileSizeInBytes = file.size;
        const maxSize = name === "logo" ? 512 * 1024 : 1024 * 1024; // 512kb for logo, 1mb for banner
        if (fileSizeInBytes > maxSize) {
          if (name === "logo") {
            setLogoError("Logo size should be less than 512kb.");
          } else {
            setBannerError("Image size should be less than 1mb.");
          }
          return;
        } else {
          setLogoError("");
          setBannerError("");
        }
      }
      setFormData({
        ...formData,
        [name]: file,
      });
    } else {
      const newValue = value.trimStart();
      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/office/update`,
        formDataToSubmit,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container pt-2">
      <div>
        <h2 style={{ color: "#007bff" }}> Office Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="form-group">
            <label>
              Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>
              Address <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label>
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email.trim()}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Landmark</label>
            <input
              type="text"
              className="form-control"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              Mobile No <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="tel"
              className="form-control"
              name="mobile"
              value={formData.mobile.trim()}
              onChange={handleChange}
              required
            />
            {mobileError && <div className="text-danger">{mobileError}</div>}
          </div>
          <div className="form-group">
            <label>
              WhatsApp No <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="tel"
              className="form-control"
              name="whatsapp"
              value={formData.whatsapp.trim()}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <div className="form-group col-6">
              <label>
                Logo
                <span className="font-italic text-sm font-weight-light">
                  (max size: 512KB , 100px X 100px)
                </span>
              </label>

              <input
                type="file"
                className="form-control"
                name="logo"
                onChange={handleChange}
                // accept="application/pdf"
              />
              {logoError && <div className="text-danger">{logoError}</div>}
              <Image
                src={`${
                  process.env.NEXT_PUBLIC_BACKPUBLIC
                }/${formData?.logo?.slice(7)}`}
                width={100}
                height={100}
              />
              {/* <Image src={formData.logo} width={100} height={100} /> */}
            </div>
            <div className="form-group col-6">
              <label>
                Logo Alt{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max size: 512KB , 100px X 100px)
                </span>
              </label>

              <input
                type="file"
                className="form-control"
                name="logo_alt"
                onChange={handleChange}
                accept="image/jpg, image/jpeg, image/png"
              />
              {logoError && <div className="text-danger">{logoError}</div>}
              <Image
                src={`${
                  process.env.NEXT_PUBLIC_BACKPUBLIC
                }/${formData?.logo_alt?.slice(7)}`}
                width={100}
                height={100}
              />
              {/* <Image src={formData.logo} width={100} height={100} /> */}
            </div>
          </div>

          <div className="form-group">
            {/* <label>
              Banner{" "}
              <span className="font-italic text-sm font-weight-light">
                (max size: 1MB, 300px X 200px)
              </span>
            </label>
            <input
              type="file"
              className="form-control-file"
              name="banner"
              onChange={handleChange}
            /> */}
            {bannerError && <div className="text-danger">{bannerError}</div>}
            {/* <Image
              src={`${
                process.env.NEXT_PUBLIC_BACKPUBLIC
              }/${formData.banner.slice(7)}`}
              width={300}
              height={200}
            /> */}
            {/* <Image src={formData.banner} width={300} height={200} /> */}
          </div>
          <div className="row">
            <div className="col-4">
              <label>
                Notification Background{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max size: 2MB , recomended size: 1080 x 720 px)
                </span>
              </label>
              <input
                type="file"
                className="form-control"
                name="notification_bg_iamge"
                onChange={handleChange}
                accept="image/jpg, image/jpeg, image/png"
              />
              {logoError && <div className="text-danger">{logoError}</div>}
              <Image
                src={`${
                  process.env.NEXT_PUBLIC_BACKPUBLIC
                }/${formData?.notification_bg_iamge?.slice(7)}`}
                width={300}
                height={100}
              />
            </div>
            <div className="col-4">
              <label>
                Activity Background{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max size: 2MB , recomended size: 1080 x 720 px)
                </span>
              </label>
              <input
                type="file"
                className="form-control"
                name="activity_bg_iamge"
                onChange={handleChange}
                accept="image/jpg, image/jpeg, image/png"
              />
              {logoError && <div className="text-danger">{logoError}</div>}
              <Image
                src={`${
                  process.env.NEXT_PUBLIC_BACKPUBLIC
                }/${formData?.activity_bg_iamge?.slice(7)}`}
                width={300}
                height={100}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Modify
          </button>
        </form>
        <hr></hr>
      </div>
    </div>
  );
}

export default Page;
