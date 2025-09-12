"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import swal from "sweetalert";

function Page() {
  const [banner, setBanner] = useState("");
  const [bannerError, setBannerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBanner = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/office/list`,
        { withCredentials: true }
      );
      console.log(response.data?.data);

      setBanner(response.data?.data?.video_banner);
    } catch (error) {
      setBannerError(error.message);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const [formData, setFormData] = useState({
    video: null,
  });

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setBannerError("File size exceeds 20MB limit.");
        setFormData({ ...formData, video: null });
      } else {
        setBannerError(null);
        setFormData({ ...formData, video: file });
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.video) {
      const formDataUpload = new FormData();
      formDataUpload.append("video", formData.video);

      setIsSubmitting(true);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/banner/video/insert`,
          formDataUpload,
          {
            withCredentials: true,
          }
        );

        if (res.status === 201) {
          setFormData({ ...formData, banner: null });
          swal("Success!", "Video Banner added successfully", "success");
          fetchBanner();
        } else {
          setBannerError(res.error);
        }
      } catch (error) {
        setBannerError(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this item!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/banner/delete/${id}`,
            { withCredentials: true }
          );
          fetchBanner();
          swal("Deleted Successfully!", {
            icon: "success",
            timer: 1000,
          });
        } catch (error) {
          console.error("Error deleting gallery item:", error);
          alert("Error deleting gallery item");
        }
      }
    });
  };

  return (
    <div className="container pt-3">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Video{" "}
            <span className="font-italic text-sm font-weight-light">
              (max size: 20MB, MP4 only)
            </span>
          </label>
          <input
            type="file"
            accept="video/mp4"
            className="form-control"
            name="video"
            onChange={handleChange}
          />
          {bannerError && <div className="text-danger">{bannerError}</div>}
          {/* {formData.banner && (
            <Image
              src={formData.banner}
              alt="Banner"
              width={300}
              height={200}
            />
          )} */}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span className="spinner-border spinner-border-sm mr-2"></span>
          )}
          {banner?.length > 0 ? "Update" : "Add"}
        </button>
      </form>

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Current Video</th>
              {/* <th scope="col">Manage</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <video src={banner} controls width={600} height={400} />
              </td>
              {/* <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
