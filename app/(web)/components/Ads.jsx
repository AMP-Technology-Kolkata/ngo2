"use client";

import React from "react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const StaticImageSlider = ({ data = [] }) => {
  return (
    <div className="ads-slider-container">
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
          gap: "1em",
          breakpoints: {
            1200: { perPage: 2, gap: "15px" },
            992: { perPage: 1, gap: "15px" },
          },
        }}
      >
        {data.map((image, index) => (
          <SplideSlide key={index}>
            <div className="slider-card">
              <div className="slider-card-image">
                <div className="image-wrapper">
                  <Image
                    className="slider-image"
                    src={image?.image}
                    alt={`Image ${index + 1}`}
                    layout="fill"
                  />
                </div>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default StaticImageSlider;
