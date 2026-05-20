import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import ContactForm from "../components/ContactForm";

async function getData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });
    if (!officeData.ok) {
      return console.error(`Failed to fetch office data: ${res.statusText}`);
    }

    return officeData.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

const handleSubmit = async (state, e) => {
  "use server";
  let formData = {
    name: e.get("name"),
    email: e.get("email"),
    message: e.get("message"),
    phone: e.get("phone"),
  };

  try {
    const response = await fetch(`${process.env.BACKLINK}/public/contact-us`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    console.error(error);
  }
};

export default async function ContactSection() {
  const data = await getData();
  const officeData = data?.data;

  return (
    <section id="contact" className="contact py-5" style={{ backgroundColor: "aliceblue" }}>
      <div className="container">
        <div className="section-title">
          <h2>Contact</h2>
          <h5>Get in Touch with Us Today for Expert Guidance and Support</h5>
        </div>
        <div className="row">
          <div className="col-lg-5 d-flex align-items-stretch">
            <div className="info">
              <div className="address">
                <FaMapMarkerAlt />
                <h4>Location:</h4>
                <p>{officeData?.address}</p>
              </div>
              <div className="email">
                <FaEnvelope />
                <h4>Email:</h4>
                <p>{officeData?.email}</p>
              </div>
              <div className="phone">
                <FaPhone />
                <h4>Call:</h4>
                <p>
                  {officeData?.mobile}
                  <br />
                  {officeData?.whatsapp}{" "}
                </p>
              </div>
              <iframe
                src={`https://maps.google.com/maps?&q="${officeData?.address}${officeData?.landmark}"&output=embed`}
                style={{ border: 0, width: "100%", height: "290px" }}
                allowFullScreen
                title="Google Map"
              ></iframe>
            </div>
          </div>
          <div className="col-lg-7 mt-5 mt-lg-0 d-flex align-items-stretch">
            <ContactForm handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </section>
  );
}
