import { FaAngleUp, FaWhatsapp } from "react-icons/fa";
import styles from "../styles/floatButton.module.css";

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

export default async function WhatsAppButton() {
  const data = await getData();
  return (
    <div>
      <a
        href={`https://api.whatsapp.com/send?phone=91${data?.data?.whatsapp}&text=Please%20contact`}
        className={styles.float}
        target="_blank"
      >
        <FaWhatsapp className={styles.myFloat} />
      </a>
    </div>
  );
}
