"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const VideoShow = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const videos = [
    {
      id: 1,
      title: "Video 1",
      url: "https://www.youtube.com/embed/tsnHTHiwJ6A?autoplay=1&mute=1",
    },
  ];

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        contentLabel="Video Gallery"
        ariaHideApp={false}
        style={{
          content: {
            width: "100vw",
            height: "100vh",
            borderRadius: "10px",
            padding: "20px",
            inset: "auto",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            overflow: "auto",
          },
          overlay: {
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleCloseModal}
            style={{
              backgroundColor: "#ff5c5c",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: "pointer",
              marginBottom: "15px",
            }}
          >
            Close
          </button>
          <div style={{ display: "grid", gap: "15px" }}>
            {videos.map((video, index) => (
              <div key={index}>
                <iframe
                  width="100%"
                  height="600"
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: "10px" }}
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoShow;
