import React from "react";
import StaticImageSlider from "../components/Ads";

async function getAdsData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
    });
    officeData = await officeData.json();
    const isActive = officeData.data?.enabled_services?.includes("ads");

    if (!isActive) return;

    const res = await fetch(`${process.env.BACKLINK}/public/ads`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return console.error(`Failed to fetch ads data: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export default async function Ads() {
  const ads = await getAdsData();
  const adsActive = ads && ads.data?.length > 0;

  if (!adsActive) {
    return null;
  }

  return <StaticImageSlider data={ads?.data} active={adsActive} />;
}
