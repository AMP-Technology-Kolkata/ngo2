"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Head from "next/head";
import NavBar from "./NavBar";
import Image from "next/image";
import GoogleTranslate from "./GoogleTranslate";

const Header = ({ data, links = {}, bg = "" }) => {
  const [activeSection, setActiveSection] = useState("");

  const sections = ["home", "about", "services", "gallery", "team", "contact"];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let sectionInView = false;

      sections.forEach((section) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          const { offsetTop, offsetHeight } = sectionElement;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            sectionInView = true;
            setActiveSection(section);
          }
        }
      });

      if (!sectionInView) {
        setActiveSection("");
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [sections]);

  const handleDropdownClick = (e) => {
    if (navbarMobile) {
      e.preventDefault();
      setContactDropdownActive(!contactDropdownActive);
    }
  };

  const handleScrollTo = (e) => {};

  return (
    <>
      <div className="container-fluid px-0 wow fadeIn" style={{ backgroundColor: "#192f59" }} data-wow-delay="0.1s">
        <div className="row gx-0 align-items-center d-md-flex d-lg-flex headerwraper">
          <div className="col-lg-6 col-md-6 ps-2 d-md-flex text-start iconwraper">
            <div className="contact-info d-flex align-items-center fontsize">
              <i className="far fa-envelope text-light"></i>
              <a className="ms-1 text-light text-decoration-none fw-semibold " href={"mailto:" + data?.email}>
                {data?.email}
              </a>
              <i className="ms-2 fa fa-phone text-light"></i>
              <a className="ms-1 text-light text-decoration-none fw-semibold " href={"tel:" + data?.mobile}>
                +91 {data?.mobile}
              </a>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 px-3 headerrightsec">
            <div className="h-100 d-inline-flex align-items-center">
              <a style={{ marginRight: "16px" }}>
                {" "}
                <GoogleTranslate />
              </a>

              {links?.facebook && (
                <a className="btn-square text-light  rounded-0 text-decoration-none d-none d-md-none d-lg-flex" href={links?.facebook} target="_blank">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {links?.twitter && (
                <a className="btn-square text-light  rounded-0 text-decoration-none d-none d-md-none d-lg-flex" href={links?.twitter} target="_blank">
                  <i className="fab fa-twitter"></i>
                </a>
              )}
              {links?.instagram && (
                <a className="btn-square text-light  rounded-0 text-decoration-none d-none d-md-none d-lg-flex" href={links?.instagram} target="_blank">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {links?.linkedin && (
                <a className="btn-square text-light  rounded-0 text-decoration-none d-none d-md-none d-lg-flex" href={links?.linkedin} target="_blank">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="container-fluid py-2 px-5  backimage"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKPUBLIC}/${bg?.slice(7)})`,
        }}
      >
        <div className="row align-items-center top-bar">
          <div className="col-lg-4 col-md-12 text-center w-100">
            {/* <a className="navbar-brand m-0 p-0 d-flex align-items-center justify-content-between " href="/">
              <Image src={`${process.env.NEXT_PUBLIC_BACKPUBLIC}/${data?.logo?.slice(7)}`} alt={data?.name} width={250} height={100} style={{ zIndex: 500 }} />
              {data?.logo_alt && (
                <Image className="altimge" src={`${process.env.NEXT_PUBLIC_BACKPUBLIC}/${data?.logo_alt?.slice(7)}`} width={250} height={100} style={{ zIndex: 500 }} />
              )}
            </a> */}
          </div>
        </div>
      </div>
      <NavBar />
    </>
  );
};

export default Header;
