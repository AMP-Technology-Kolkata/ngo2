// "use client";
// import { Splide, SplideSlide } from "@splidejs/react-splide";
// import "@splidejs/react-splide/css";

// const HeroSection = ({ images = [] }) => {
//   return (
//     <section id="home">
//       <Splide
//         options={{
//           type: "loop",
//           rewind: true,
//           perPage: 1,
//           autoplay: true,
//           interval: 3000,
//           pagination: true,
//           arrows: false,
//         }}
//       >
//         {images?.map((image, index) => (
//           <SplideSlide key={index}>
//             <div className="carousel-item active">
//               <a href={image?.link}>
//                 <img
//                   className="heroimage"
//                   src={`${process.env.NEXT_PUBLIC_BACKPUBLIC}/${image?.slice(7)}`}
//                   alt={"Banner " + index}
//                   style={{ width: "100%", height: "65vh", objectFit: "cover" }}
//                 />
//               </a>
//             </div>
//           </SplideSlide>
//         ))}
//       </Splide>
//     </section>
//   );
// };

// export default HeroSection;

"use client";
import React from "react";
import ReactPlayer from "react-player";
import "bootstrap/dist/css/bootstrap.min.css";

const HeroSection = ({ data = "" }) => {
  return (
    <div className="container-fluid px-0 ">
      <div
        className="bannervideo"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: "#000",
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>
          <ReactPlayer
            url={data}
            playing={true}
            controls
            muted
            loop
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
