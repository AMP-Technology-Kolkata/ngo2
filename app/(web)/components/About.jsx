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
    <div ref={ref} className="backimge" id="about">
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
              className={styles.imageContainer}
              initial={{ opacity: 0, x: -100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1.5 }}
              >
                <Image
                  src={aboutData?.image}
                  alt="About"
                  width={500}
                  height={400}
                  style={{ backgroundSize: "cover" }}
                />
              </motion.div>

              <motion.div
                className={styles.videoContainer}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.6, duration: 1.5 }}
              >
                <ReactPlayer
                  className={styles.playButtonOverlay}
                  url={aboutData?.video}
                  controls={true}
                  width={280}
                  height={220}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className={styles.welcomeContent}
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
            >
              <div className={styles.sidebar}>
                <div className={styles.dot_wrper}>
                  <p>Welcome To</p>
                  <span className={styles.text}>{officeName}</span>
                </div>
              </div>
              <p>
                {showFullDescription
                  ? aboutData?.description
                  : `${aboutData?.description.slice(0, 500)}...`}
                {!showFullDescription && (
                  <Link
                    href="/About"
                    style={{ color: "blue", marginLeft: "5px" }}
                  >
                    Read More
                  </Link>
                )}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
