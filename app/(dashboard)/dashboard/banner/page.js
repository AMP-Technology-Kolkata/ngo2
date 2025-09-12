"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import swal from "sweetalert";

function Page() {
  const [banner, setBanner] = useState([]);
  const [bannerError, setBannerError] = useState(null);
  const fetchBanner = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/office/list`,
        { withCredentials: true }
      );
      setBanner(response.data?.data?.banner);
    } catch (error) {
      setBannerError(error.message);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const [formData, setFormData] = useState({
    banner: null,
  });

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setBannerError("File size exceeds 1MB limit.");
        setFormData({ ...formData, banner: null });
      } else {
        setBannerError(null);
        setFormData({ ...formData, banner: file });
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.banner) {
      const formDataUpload = new FormData();
      formDataUpload.append("banner", formData.banner);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/banner/insert`,
          formDataUpload,
          {
            withCredentials: true,
          }
        );

        if (res.status === 201) {
          setFormData({ ...formData, banner: null });
          swal("Success!", "Banner added successfully", "success");
          fetchBanner();
        } else {
          setBannerError(res.error);
        }
      } catch (error) {
        setBannerError(error);
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
            Banner{" "}
            <span className="font-italic text-sm font-weight-light">
              (max size: 1MB, 600px X 400px)
            </span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            name="banner"
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
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Banner</th>
              <th scope="col">Manage</th>
            </tr>
          </thead>
          <tbody>
            {banner?.map((banner, index) => (
              <tr key={index}>
                <td>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKPUBLIC}/${banner.slice(
                      7
                    )}`}
                    alt={`Banner ${index}`}
                    width={400}
                    height={250}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
