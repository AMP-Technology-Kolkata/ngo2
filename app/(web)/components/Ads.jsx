"use client";

import React from "react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const StaticImageSlider = ({ data = [] }) => {
  const normalizeImageSrc = (src) => {
    if (typeof src !== "string") return "";
    const cleaned = src.trim();
    if (!cleaned || cleaned.toLowerCase() === "null" || cleaned.toLowerCase() === "undefined") {
      return "";
    }
    if (/^https?:\/\//i.test(cleaned) || cleaned.startsWith("/")) {
      return cleaned;
    }
    return `/${cleaned.replace(/^\/+/, "")}`;
  };

  const validImages = (data || []).filter((item) => normalizeImageSrc(item?.image));

  if (!validImages.length) {
    return null;
  }

  return (
    <section className="ads-slider-container">
      <div className="ads-header">
        <span className="ads-kicker">Announcements</span>
        <h2 className="ads-title">Featured Ads</h2>
        <p className="ads-subtitle">Highlighted notices and promotional banners presented in a clean, professional carousel.</p>
      </div>
      <Splide
        options={{
          type: "loop",
          perMove: 1,
          rewind: true,
          pagination: false,
          arrows: true,
          autoplay: true,
          interval: 3000,
          perPage: 3,
          gap: "1.25rem",
          breakpoints: {
            1200: { perPage: 2, gap: "1rem" },
            992: { perPage: 1, gap: "1rem" },
          },
        }}
      >
        {validImages.map((image, index) => (
          <SplideSlide key={index}>
            <div className="slider-card">
              <div className="slider-card-image">
                <div className="image-wrapper">
                  <Image
                    className="slider-image"
                    src={normalizeImageSrc(image?.image)}
                    alt={`Image ${index + 1}`}
                    fill
                    sizes="(max-width: 992px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
};

export default StaticImageSlider;
