"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

function SocialLinksForm() {
  const [formData, setFormData] = useState({
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    twitter: "",
  });

  const fetchLinks = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/social/list`,
      {
        withCredentials: true,
      }
    );
    setFormData({
      facebook: res.data?.data.facebook,
      instagram: res.data?.data.instagram,
      linkedin: res.data?.data.linkedin,
      twitter: res.data?.data.twitter,
      youtube: res.data?.data.youtube,
    });
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/social/insert`,
        formData,
        { withCredentials: true }
      );

      res.status === 201 && swal("Success", res.data.message, "success");
      fetchLinks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Facebook</label>
          <input
            type="url"
            className="form-control"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Instagram</label>
          <input
            type="url"
            className="form-control"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>YouTube</label>
          <input
            type="url"
            className="form-control"
            name="youtube"
            value={formData.youtube}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            className="form-control"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Twitter</label>
          <input
            type="url"
            className="form-control"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}

export default SocialLinksForm;
