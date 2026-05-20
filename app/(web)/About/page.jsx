export const dynamic = "force-dynamic";

import React from "react";
import Aboutus from "../components/About";

async function getAboutData() {
  try {
    const res = await fetch(
      `${process.env.BACKLINK}/public/about`,
      {
        headers: {
          "x-api-key": process.env.API_KEY,
          "office-id": process.env.OFFICE,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("About API Error:", res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("About fetch error:", error.message);
    return null;
  }
}

async function getOfficeData() {
  try {
    const res = await fetch(
      `${process.env.BACKLINK}/public/officeData`,
      {
        headers: {
          "x-api-key": process.env.API_KEY,
          "office-id": process.env.OFFICE,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Office API Error:", res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Office fetch error:", error.message);
    return null;
  }
}

export default async function About() {
  // parallel fetch (faster)
  const [aboutRes, officeRes] = await Promise.all([
    getAboutData(),
    getOfficeData(),
  ]);

  const aboutData = aboutRes?.data || null;
  const officeName = officeRes?.data?.name || "";

  return (
    <Aboutus
      aboutData={aboutData}
      officeName={officeName}
      showFullDescription={true}
    />
  );
}