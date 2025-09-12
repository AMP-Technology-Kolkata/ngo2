import FaqSec from "../components/Faq";

async function getData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });
    officeData = await officeData.json();
    const isActive = officeData.data?.enabled_services?.includes("faq");

    if (!isActive) return null;

    const res = await fetch(`${process.env.BACKLINK}/public/faq`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch service data: ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data.data ? data.data : [];
  } catch (error) {
    console.error("Error:", error.message);
    return [];
  }
}

export default async function Faq() {
  let data = await getData();
  if (!data || data.length === 0) return null;

  return <FaqSec faqData={data} />;
}
