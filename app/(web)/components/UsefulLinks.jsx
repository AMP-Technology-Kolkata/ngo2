"use client";
import React from "react";
import Link from "next/link";

const UsefulLinks = ({ data = [] }) => {
  const links = Array.isArray(data) ? data : [];

  if (!links.length) {
    return null;
  }

  return (
    <section className="useful-links-section py-5">
      <div className="container">
        <div className="useful-links-shell">
          <div className="useful-links-header">
            <span className="useful-links-kicker">Quick Access</span>
            <h3 className="useful-links-title">Useful Links</h3>
            <p className="useful-links-subtitle">
              Fast access to important destinations, arranged in a clean orange and white layout.
            </p>
          </div>

          <div className="useful-links-grid">
            {links.map((item, index) => (
              <Link key={index} href={item.link} className="useful-links-card text-decoration-none">
                <span className="useful-links-card__index">0{index + 1}</span>
                <span className="blinking-link useful-links-card__name">{item.name}</span>
                <span className="useful-links-card__arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h12" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .useful-links-section {
          background: linear-gradient(180deg, #fffaf2 0%, #fff4e0 100%);
        }

        .useful-links-shell {
          max-width: 1240px;
          margin: 0 auto;
          padding: 28px 22px 26px;
          border-radius: 28px;
          background: linear-gradient(180deg, #ffffff 0%, #fff9ef 100%);
          border: 1px solid rgba(183, 123, 31, 0.14);
          box-shadow: 0 24px 54px rgba(118, 78, 12, 0.12);
        }

        .useful-links-header {
          text-align: center;
          margin-bottom: 22px;
        }

        .useful-links-kicker {
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 999px;
          background: #fff0c7;
          color: #946100;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .useful-links-title {
          margin: 12px 0 10px;
          color: #192f59;
          font-size: clamp(1.8rem, 2.4vw, 2.4rem);
          font-weight: 800;
        }

        .useful-links-subtitle {
          max-width: 720px;
          margin: 0 auto;
          color: #6f5329;
          font-size: 1rem;
          line-height: 1.7;
        }

        .useful-links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .useful-links-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-radius: 18px;
          background: linear-gradient(180deg, #ffffff 0%, #fff7e8 100%);
          border: 1px solid rgba(183, 123, 31, 0.14);
          box-shadow: 0 14px 28px rgba(96, 61, 10, 0.1);
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          min-height: 78px;
        }

        .useful-links-card:hover {
          transform: translateY(-3px);
          border-color: rgba(214, 139, 29, 0.26);
          box-shadow: 0 18px 34px rgba(96, 61, 10, 0.14);
        }

        .useful-links-card__index {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fff0c7 0%, #f6a52e 100%);
          color: #8a4c00;
          font-size: 0.78rem;
          font-weight: 800;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
        }

        .useful-links-card__name {
          flex: 1 1 auto;
          display: block;
          font-size: 0.98rem;
          font-weight: 700;
          line-height: 1.45;
          animation: none;
          color: #8b4d00;
          text-decoration: none;
        }

        .useful-links-card__arrow {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff0d2;
          color: #d97706;
        }

        @media (max-width: 768px) {
          .useful-links-shell {
            padding: 20px 14px;
            border-radius: 22px;
          }

          .useful-links-grid {
            grid-template-columns: 1fr;
          }

          .useful-links-header {
            margin-bottom: 18px;
          }
        }
      `}</style>
    </section>
  );
};

export default UsefulLinks;
