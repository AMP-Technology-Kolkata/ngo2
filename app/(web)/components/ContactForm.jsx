"use client";
import swal from "sweetalert";
import { useFormState, useEffect } from "react-dom";

export default function ContactForm({ handleSubmit }) {
  const [state, formAction] = useFormState(handleSubmit, null);
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

  return (
    <form action={formAction} className="php-email-form" id="contactForm">
      <div className="row mb-2">
        <div className="form-group">
          <label htmlFor="name">
            Your Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="name"
            // value={formData.name}
            // onChange={handleChange}
            className="form-control"
            id="name"
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="form-group col-md-6">
          <label htmlFor="phone">
            Mobile No <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            className="form-control"
            name="phone"
            // value={formData.phone}
            // onChange={handleChange}
            pattern="[0-9]{10}"
            title="Enter 10 digit mobile number"
            required
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="email">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            // value={formData.email}
            // onChange={handleChange}
            className="form-control"
            name="email"
            id="email"
            required
          />
        </div>
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
  );
}
