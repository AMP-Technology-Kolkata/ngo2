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
        <button
          type="button"
          className={styles.floatArrow}
          onClick={handleScrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <FaAngleUp className={styles.myFloatArrow} />
        </button>
      )}
    </div>
  );
};

export default Arrowup;
