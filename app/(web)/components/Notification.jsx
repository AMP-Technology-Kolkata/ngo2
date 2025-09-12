"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const TenderNotifications = ({ data, bgImgae = "", count = [] }) => {
  const [activeTab, setActiveTab] = useState("tender");
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
    }
  }, [inView]);

  const filteredData = data.filter((item) => item.type === activeTab);

  const chunkedStats = [];
  for (let i = 0; i < count?.length; i += 4) {
    chunkedStats.push(count?.slice(i, i + 4));
  }

  return (
    <div
      className="tender-notifications"
      ref={ref}
      style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKPUBLIC}/${bgImgae?.slice(7)})`,
      }}
    >
      {/* Left Section */}
      <div className="left-section">
        <div className="tabs">
          <button className={activeTab === "tender" ? "active" : ""} onClick={() => setActiveTab("tender")}>
            TENDER
          </button>
          <button className={activeTab === "notice" ? "active" : ""} onClick={() => setActiveTab("notice")}>
            NOTICE
          </button>
        </div>
        <div className="marquee-section">
          <marquee
            direction="up"
            id="notice"
            scrollAmount="3"
            style={{ height: "100%", background: "#f2f2f2", padding: "10px" }}
            onMouseOver={() => document.getElementById("notice").stop()}
            onMouseOut={() => document.getElementById("notice").start()}
          >
            {filteredData.map((item, index) => (
              <div key={index} className="notice-card">
                <div className="notice-header">
                  <p className="notice-date">
                    {moment(item.start_date).format("DD-MM-YYYY")}
                    {/* <span className="new-blink">New*</span> */}
                    <img src="/new.gif" alt="New" className="new-blink" />
                  </p>
                  <a href={`${process.env.NEXT_PUBLIC_BACKPUBLIC}/${item.link?.slice(7)}`} className="notice-link" target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </div>
                <p className="notice-title">{item.title}</p>
              </div>
            ))}
          </marquee>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="stats">
          {chunkedStats[0]?.map((stat, index) => (
            <div className="stat-row" key={index}>
              <p>{stat.text}</p>
              <h2>
                <CountUp end={stat.value} duration={2} start={inView ? null : 0} />
              </h2>
            </div>
          ))}
        </div>

        <div className="additional-sections">
          <div className="archives">
            <h3>FAQ</h3>
            <a href="/faq">
              <button>CLICK HERE</button>
            </a>
          </div>
          <div className="citizen-forum">
            <h3>Grievance</h3>
            <a href="/grievance">
              <button>CLICK HERE</button>
            </a>
          </div>
        </div>
      </div>

      {/* Styling */}
      <style jsx>{`
        /* Styles for tender-notifications component */
        .tender-notifications {
          position: relative;
          background: url("/background_img.jpg") no-repeat center center;
          background-size: cover;
          padding: 70px;
          color: white;
          margin-bottom: 50px;
          display: flex;
          justify-content: space-between;
          border-radius: 10px;
        }
        .tender-notifications::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(25, 47, 89, 0.7);
          z-index: 1;
          border-radius: 15px;
        }
        .left-section,
        .right-section {
          position: relative;
          z-index: 2;
          width: 48%;
        }
        .tabs {
          display: flex;
          margin-bottom: 1px;
        }
        .tabs button {
          padding: 10px;
          border: none;
          background: #003366;
          color: white;
          cursor: pointer;
        }
        .tabs .active {
          background: #00509e;
        }
        .marquee-section {
          height: 300px;
          overflow: hidden;
          border-radius: 10px;
          width: 100%;
        }
        .notice-card {
          margin-bottom: 20px;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
          padding: 15px;
          border-radius: 10px;
          background: #ffffff;
        }
        .notice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .notice-date {
          color: red;
          font-size: 14px;
          margin: 0;
        }
        .notice-link {
          background: #192f59;
          color: white;
          padding: 5px 15px;
          border-radius: 5px;
          font-size: 12px;
          font-weight: bold;
          text-decoration: none;
        }
        .notice-title {
          font-size: 16px;
          line-height: 1.4;
          margin: 0;
          color: black;
        }
        .stats {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 20px;
        }
        .stat-row {
          width: 48%;
          margin-bottom: 16px;
          text-align: center;
        }

        .additional-sections {
          display: flex;
          justify-content: space-between;
        }
        .archives,
        .citizen-forum {
          background: #003366;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
          flex: 1;
          margin-right: 10px;
        }
        .citizen-forum {
          background: #333;
        }
        .archives button,
        .citizen-forum button {
          background: #00509e;
          color: white;
          padding: 10px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          text-decoration: none;
        }
        .new-blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%,
          50%,
          100% {
            opacity: 1;
          }
          25%,
          75% {
            opacity: 0;
          }
        }
        @media (max-width: 868px) {
          .tender-notifications {
            flex-direction: column;
            align-items: center;
          }
          .left-section,
          .right-section {
            width: 90%;
            margin-top: 25px;
          }
          .archives,
          .citizen-forum {
            font-size: 13px;
            padding: 8px;
          }
          @media (max-width: 699px) {
            .archives,
            .citizen-forum {
              font-size: 11px;
              padding: 6px;
            }
            .archives,
            h3 {
              font-size: 12px;
            }
            .archives button,
            .citizen-forum button {
              padding: 3px;
              font-size: 8px;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default TenderNotifications;
