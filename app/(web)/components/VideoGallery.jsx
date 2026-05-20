"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";

const VideoGallery = ({ data = [] }) => {
  const getVideoId = (url) => {
    if (typeof url !== "string") return "";

    const trimmed = url.trim();
    if (!trimmed || trimmed.toLowerCase() === "null" || trimmed.toLowerCase() === "undefined") {
      return "";
    }

    try {
      const parsed = new URL(trimmed);

      if (parsed.hostname.includes("youtu.be")) {
        return parsed.pathname.replace(/^\//, "").split("/")[0] || "";
      }

      if (parsed.hostname.includes("youtube.com")) {
        if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");
        const pathParts = parsed.pathname.split("/").filter(Boolean);
        if (pathParts[0] === "shorts" && pathParts[1]) return pathParts[1];
        if (pathParts[0] === "embed" && pathParts[1]) return pathParts[1];
      }
    } catch (error) {
      return "";
    }

    return "";
  };

  const validVideos = (Array.isArray(data) ? data : []).filter((video) => getVideoId(video?.link));

  if (!validVideos.length) {
    return null;
  }

  const shouldLoop = validVideos.length > 5;

  const settings = {
    type: shouldLoop ? "loop" : "slide",
    perMove: 1,
    rewind: shouldLoop,
    autoplay: shouldLoop,
    arrows: shouldLoop,
    pagination: false,
    interval: 3000,
    gap: "1rem",
    perPage: Math.min(5, validVideos.length),
    direction: "rtl",
    breakpoints: {
      1200: { perPage: Math.min(4, validVideos.length) },
      992: { perPage: Math.min(3, validVideos.length) },
      768: { perPage: Math.min(2, validVideos.length) },
      576: { perPage: 1 },
    },
  };

  const getYouTubeThumbnail = (url) => `https://img.youtube.com/vi/${getVideoId(url)}/0.jpg`;

  return (
    <div className="container">
      <div className="py-5">
        <h2 className="text-center display-10 fw-bold mb-4" style={{ color: "#192f59" }}>
          Our Videos
        </h2>
        <Splide options={settings}>
          {validVideos.map((video, index) => (
            <SplideSlide key={index}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <a href={video.link} target="_blank" rel="noopener noreferrer" className="thumbnail-container">
                  <img
                    src={getYouTubeThumbnail(video.link)}
                    alt={`Video thumbnail ${index + 1}`}
                    width={250}
                    height={200}
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                      display: "block",
                    }}
                  />
                </a>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
};

export default VideoGallery;
