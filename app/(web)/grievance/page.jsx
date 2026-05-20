"use client";
import swal from "sweetalert";
import { handleSubmit } from "./submit";
import { useFormState } from "react-dom";
import { useState } from "react";
import axios from "axios";

export default function Page() {
  const [state, formAction] = useFormState(handleSubmit, null);
  const [location, setLocation] = useState("");

  if (state?.success) {
    swal({
      icon: "success",
      title: "Thank You!",
      text: "Message sent Succesfully! Our team will get back to you shortly.",
      showConfirmButton: false,
      timer: 3500,
    });
    document.getElementById("contactForm").reset();
  } else if (state?.success === false) {
    swal({
      icon: "error",
      title: "Error!",
      text: "Something went wrong. Please try again later.",
      showConfirmButton: false,
      timer: 3500,
    });
  }

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
      const address = response.data.display_name;
      setLocation(address);
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            swal({
              icon: "info",
              title: "Location Permission Denied",
              text: "Please allow location access in your browser settings and try again.",
              buttons: {
                retry: "Retry",
                cancel: "Cancel",
              },
            }).then((value) => {
              if (value === "retry") {
                detectLocation();
              }
            });
          }
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <section id="contact" className="contact grievance-page py-5">
      <div className="container">
        <div className="section-title">
          <h2>Grievance</h2>
          <h5>We are Committed to Addressing Your Concerns</h5>
        </div>
        <div className="row">
          <div className="col-9 mt-5 mt-lg-0 mx-auto grivencefrom">
            <form action={formAction} className="php-email-form" id="contactForm" typeof="multipart/form-data">
              <div className="row mb-2">
                <div className="form-group">
                  <label htmlFor="name">
                    Your Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="name" className="form-control" id="name" required />
                </div>
              </div>
              <div className="row mb-2">
                <div className="form-group col-md-6">
                  <label htmlFor="phone">
                    Mobile No <span className="text-danger">*</span>
                  </label>
                  <input type="tel" id="phone" className="form-control" name="phone" pattern="[0-9]{10}" title="Enter 10 digit mobile number" required />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="email">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input type="email" className="form-control" name="email" id="email" required />
                </div>
              </div>

              <div className="form-group">
                <p>Your Location</p>
                <div className="input-group mb-2">
                  {/* <input type="textarea" className="form-control" name="location" value={location} onChange={(e) => setLocation(e.target.value)} /> */}
                  <textarea className="form-control" rows="2" minLength={20} name="location" value={location} onChange={(e) => setLocation(e.target.value)}></textarea>
                  <button className="btn btn-primary location-btn" type="button" onClick={detectLocation}>
                    Detect Location
                  </button>
                </div>
              </div>

              <div className="form-group mt-3">
                <label htmlFor="file" className="form-label">
                  Upload Document (pdf only)
                </label>
                <input type="file" className="form-control" name="document" id="file" accept="application/pdf" />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="message">
                  Message <span className="text-danger">*</span>
                </label>
                <textarea className="form-control" name="message" rows="10" required minLength={25}></textarea>
              </div>
              <div className="text-center">
                <button type="submit">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
