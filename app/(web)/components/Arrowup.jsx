"use client";
import { useState, useEffect } from "react";
import { FaAngleUp } from "react-icons/fa";
import styles from "../styles/floatButton.module.css";

const Arrowup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {isVisible && (
        <a href="#" className={styles.floatArrow} onClick={handleScrollToTop}>
          <FaAngleUp className={styles.myFloatArrow} />
        </a>
      )}
    </div>
  );
};

export default Arrowup;
