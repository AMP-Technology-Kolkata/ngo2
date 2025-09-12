"use client";
import React from "react";
import ReactPlayer from "react-player/youtube";
import "bootstrap/dist/css/bootstrap.min.css";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";

const VideoGallery = ({ data = [] }) => {
  const settings = {
    type: "loop",
    perMove: 1,
    rewind: false,
    autoplay: true,
    arrows: true,
    pagination: false,
    interval: 3000,
    gap: "1rem",
    perPage: 5,
    direction: "rtl",
    breakpoints: {
      1200: { perPage: 4 },
      992: { perPage: 3 },
      768: { perPage: 2 },
      576: { perPage: 1 },
    },
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  };

  return (
    <div className="container">
      <div className="py-5">
        <h2 className="text-center display-10 fw-bold mb-4" style={{ color: "#192f59" }}>
          Our Videos
        </h2>
        <Splide options={settings}>
          {data.map((video, index) => (
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
