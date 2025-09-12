"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

function Page() {
  const [officeDetails, setOfficeDetails] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    image: "",
    video: "",
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    let newValue = value;
    if (name === "description" || name === "video") {
      newValue = value.trimStart();
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "image" ? files[0] : newValue,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.description === "") {
      alert("Description is required!");
      return;
    }

    // Create a new FormData object
    const formDataToSend = new FormData();
    // formDataToSend.append("office", formDataWithOffice.office);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("video", formData.video);
    // add
    //   try {
    //     await axios.post(
    //       "http://localhost:8443/api/dashboard/about_us/insert",
    //       formDataToSend,
    //       {
    //         withCredentials: true,
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       }
    //     );
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 1000);
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };
    try {
      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/about_us/update`,
          formDataToSend,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/about_us/update`,
          formDataToSend,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      swal("Success!", "Office added successfully!", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      swal(
        "Error!",
        "Something went wrong! Make sure all fields are filled",
        "error"
      );
      console.error("Error:", error);
    }
  };

  // listview
  useEffect(() => {
    async function getAbout() {
      const about = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/about_us/list`,
        {
          withCredentials: true,
        }
      );
      setOfficeDetails(about?.data?.data);
      if (about?.data?.data.length !== 0) {
        setShowForm(false);
      }
    }
    getAbout();
  }, []);
  // delete
  const handleDelete = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this office!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/about_us/delete/${id}`,
            { withCredentials: true }
          );
          if (response.status === 200) {
            swal("Deleted Successfully!", {
              icon: "success",
            });
            const updatedOfficeDetails = officeDetails.filter(
              (office) => office._id !== id
            );
            setOfficeDetails(updatedOfficeDetails);
          }
        } catch (error) {
          console.error("Error while deleting office:", error);
        }
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };
  // edit
  const handleEdit = (id) => {
    window.scrollTo(0, 0);
    // Find the office with the given ID
    const officeToEdit = officeDetails.find((office) => office._id === id);
    if (officeToEdit) {
      setFormData({
        description: officeToEdit.description,
        image: officeToEdit.image,
        video: officeToEdit.video,
      });
      setEditId(id);
      setShowForm(true);
    }
  };

  return (
    <div className="container pt-3">
      {showForm && (
        <div>
          <h2 style={{ color: "#007bff" }}>Edit About Us</h2>
          <form
            method="post"
            onSubmit={handleSubmit}
            // encType="multipart/form-data"
          >
            {/* <input
              type="hidden"
              value="65f2fd86c51f40feac95a711"
              name="office"
            /> */}
            <div className="form-group">
              <label>
                Description{" "}
                <span className="font-italic text-sm font-weight-light">
                  (max length: 2000 characters)
                </span>
              </label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={500}
              />
            </div>
            <div className="form-group">
              <label>
                Image{" "}
                <span className="font-italic text-sm font-weight-light">
                  (800px X 400px)
                </span>
              </label>
              <input
                type="file"
                className="form-control"
                name="image"
                accept="image/jpg, image/jpeg, image/png"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label for="link">Video Link (Youtube Only)</label>
              <input
                type="url"
                id="link"
                className="form-control"
                name="video"
                value={formData.video}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              EDIT
            </button>
          </form>
          <hr />
        </div>
      )}

      <h2 style={{ color: "#007bff" }}>About Us</h2>
      <div className="card-body">
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Description</th>
              <th>Image</th>
              <th>Video Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {officeDetails?.map((office, index) => (
              <tr key={index}>
                <td>{office.description}</td>
                <td>
                  <img
                    style={{ width: 400, height: 200 }}
                    src={office?.image}
                    alt={`Logo of Office ${index + 1}`}
                  />
                </td>
                <td>
                  <a href={office.video} target="_blank">
                    {office.video}
                  </a>
                </td>
                <td>
                  <div className="d-flex align-self-center">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(office._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(office._id)}
                    >
                      Delete
                    </button>
                  </div>
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
