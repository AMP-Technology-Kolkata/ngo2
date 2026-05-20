"use client";
import { useEffect, useState } from "react";
import styles from "../styles/gallery.module.css";
import { Modal } from "react-bootstrap";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Gallery = ({ data = [], loadButton = false }) => {
  const [modalImg, setModalImg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (src) => {
    setModalImg(src);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.classList.contains("gallery-item")) {
        const src = e.target.getAttribute("src");
        handleShowModal(src);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  return (
    <section className={`${styles.gallery} py-5`} id="gallery">
      <div className={styles.sectiontitle}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "33px",
            color: "#192f59",
          }}
          className="display-10 fw-bold"
        >
          Gallery
        </h2>
      </div>
      <div className="container-lg">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="row gy-4 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4">
            {data?.map((item, index) => (
              <motion.div
                className="col"
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              >
                <Image
                  width={300}
                  height={250}
                  src={item.image}
                  className="gallery-item"
                  alt={item.text}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {loadButton && (
          <div className="text-center py-5">
            <a
              href="/gallery"
              className="btn"
              style={{ background: "#4099de", color: "white" }}
            >
              Show More
            </a>
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="d-flex justify-content-center align-items-center">
          <img
            src={modalImg}
            className="modal-img"
            alt="modal img"
            style={{
              width: "500px",
              height: "500px",
              objectFit: "cover",
            }}
          />
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Gallery;
