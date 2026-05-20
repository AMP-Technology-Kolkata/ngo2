"use client";
import ReactPlayer from "react-player";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/AboutSection.module.css";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function AboutSection({
  aboutData,
  showFullDescription,
  officeName,
}) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="backimge about-section" id="about">
      <div className="container">
        <AnimatePresence mode="wait">
          <motion.div
            className={styles.welcomeSection}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={
              inView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 100, scale: 0.9 }
            }
            transition={{ duration: 2.0, ease: "easeOut" }}
          >
            <motion.div
              className={styles.mediaPanel}
              initial={{ opacity: 0, x: -60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              <div className={styles.mediaFrame}>
                <div className={styles.mediaImageWrap}>
                  <Image
                    src={aboutData?.image}
                    alt={officeName || "About"}
                    width={720}
                    height={540}
                    className={styles.mediaImage}
                  />
                </div>

                <div className={styles.videoCard}>
                  <div className={styles.videoLabel}>Official Video</div>
                  <ReactPlayer
                    className={styles.videoPlayer}
                    url={aboutData?.video}
                    controls={true}
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.contentPanel}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15, duration: 1.0, ease: "easeOut" }}
            >
              <div className={styles.eyebrow}>Welcome to</div>
              <div className={styles.sidebar}>
                <div className={styles.dotWrper}>
                  <p className={styles.kicker}>Public Information Portal</p>
                  <h2 className={styles.text}>{officeName}</h2>
                </div>
              </div>
              <p className={styles.description}>
                {showFullDescription
                  ? aboutData?.description
                  : `${aboutData?.description?.slice(0, 500) || ""}...`}
                {!showFullDescription && (
                  <Link href="/About" className={styles.readMoreLink}>
                    Read More
                  </Link>
                )}
              </p>
              <div className={styles.featureRow}>
                <span className={styles.featureChip}>Transparent Services</span>
                <span className={styles.featureChip}>Public Notice</span>
                <span className={styles.featureChip}>Citizen First</span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
