import React from "react";
import Aboutus from "../components/About";
async function getAboutData() {
  const res = await fetch(process.env.BACKLINK + "/public/about", {
    headers: {
      "x-api-key": process.env.API_KEY,
      "office-id": process.env.OFFICE,
    },
    next: {
        revalidate: 1000,
      },
  });
  if (!res.ok) {
    return res.statusText;
  }
  return res.json();
}
async function getData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: { revalidate: 1000, },
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
export default async function About({ showFullDescription = true }) {
  const data = await getAboutData();
  if (typeof data === "string") {
    return <div>Error: {data}</div>;
  }

  const aboutData = data?.data;
  const officeData = await getData();
  const officeName = officeData?.data.name;

  return (
    <Aboutus
      aboutData={aboutData}
      officeName={officeName}
      showFullDescription={showFullDescription}
    />
  );
}
