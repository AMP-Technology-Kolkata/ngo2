"use client";
import { useState } from "react";
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

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  return (
    <section className={`${styles.gallery} py-5`} id="gallery">
      <div className={styles.sectionTitleWrap}>
        <span className={styles.sectionKicker}>Visual Highlights</span>
        <h2 className={styles.sectionTitle}>Gallery</h2>
        <p className={styles.sectionSubtitle}>
          A curated view of photos presented in a clean, modern layout for easy browsing.
        </p>
      </div>
      <div className="container-lg">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className={styles.grid}>
            {data?.map((item, index) => (
              <motion.div
                className={styles.card}
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              >
                <button type="button" className={styles.imageButton} onClick={() => handleShowModal(item.image)}>
                  <Image width={420} height={320} src={item.image} className={styles.galleryImage} alt={item.text} />
                  <span className={styles.imageOverlay}>
                    <span className={styles.viewLabel}>View Image</span>
                    <span className={styles.imageTitle}>{item.text}</span>
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {loadButton && (
          <div className={styles.loadMoreWrap}>
            <a href="/gallery" className={styles.loadMoreBtn}>
              Show More
            </a>
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className={styles.galleryModal}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <img
            src={modalImg}
            className={styles.modalImg}
            alt="modal img"
          />
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Gallery;
