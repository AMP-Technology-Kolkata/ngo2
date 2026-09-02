"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCircle,
  FaHouseUser,
  FaAppStoreIos,
  FaCommentAlt,
  FaAdversal,
  FaDochub,
  FaBaby,
  FaClone,
  FaServicestack,
  FaClipboardList,
  FaQuestionCircle,
  FaInstalod,
  FaDiceD6,
  FaEnvelopeOpenText,
  FaCalendar,
  FaRegUser,
  FaPhotoVideo,
  FaBookmark,
  FaPoll,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaListAlt,
  FaTable,
  FaListUl,
  FaSignature,
  FaDownload,
  FaFileAlt,
  FaDatabase,
  FaChevronDown,
  FaUsers,
} from "react-icons/fa";
import NavItem from "./dashboard/components/NavItems";

function Sidebar() {
  const [menu, setMenu] = useState([]);
  const [officeName, setofficeName] = useState("");
  const [reportsOpen, setReportsOpen] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/office/list`,
        {
          withCredentials: true,
        }
      );
      setMenu(res.data.data.enabled_services);
      setofficeName(res.data.data.name);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const citizenLinks = [
    { href: "/dashboard/citizen/new-application", icon: FaEdit, text: "New Application" },
    { href: "/dashboard/citizen/completed-application", icon: FaCheckCircle, text: "Completed Application" },
    { href: "/dashboard/citizen/rejected-application", icon: FaTimesCircle, text: "Rejected Application" },
    { href: "/dashboard/citizen/all-application", icon: FaListAlt, text: "All Application" },
    { href: "/dashboard/citizen/manage-data", icon: FaTable, text: "Manage Data" },
    { href: "/dashboard/citizen/manage-guidelines", icon: FaListUl, text: "Manage Guidelines" },
    { href: "/dashboard/citizen/manage-signatures", icon: FaSignature, text: "Manage Signatures" },
    { href: "/dashboard/citizen/downloads", icon: FaDownload, text: "Downloads Menu" },
  ];

  const reportLinks = [
    { href: "/dashboard/citizen/reports/daily", text: "Daily Report" },
    { href: "/dashboard/citizen/reports/monthly", text: "Monthly Report" },
    { href: "/dashboard/citizen/reports/yearly", text: "Yearly Report" },
  ];

  const citizenBottomLinks = [
    { href: "/dashboard/citizen/certificate-issued", icon: FaFileAlt, text: "Certificate Issued" },
    { href: "/dashboard/citizen/old-database", icon: FaDatabase, text: "Old Database" },
  ];

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-5">
      <a href="" className="brand-link">
        <span className="brand-text font-weight-normal text-centar">
          DASHBOARD
        </span>
      </a>

      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="info">
            <a className="d-block">
              <font color="white">{officeName}</font>
            </a>
          </div>
          <div className="image">
            <img
              src="/avater.png"
              className="img-circle elevation-2"
              alt="User Image"
              width={50}
              height={50}
            />
          </div>
        </div>

        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
          >
            <NavItem
              href="/dashboard/offices"
              icon={FaHouseUser}
              text="Office Details"
            />
            <NavItem
              href="/dashboard/video_banner"
              icon={FaDiceD6}
              text="Video Banner"
            />

            {menu?.includes("about") && (
              <NavItem
                href="/dashboard/aboutus"
                icon={FaAppStoreIos}
                text="About Us"
              />
            )}

            {menu?.includes("notice") && (
              <NavItem
                href="/dashboard/notice"
                icon={FaCommentAlt}
                text="Notices"
              />
            )}

            {menu?.includes("ads") && (
              <NavItem
                href="/dashboard/adverstisement"
                icon={FaAdversal}
                text="Advertisements"
              />
            )}

            {menu?.includes("staff") && (
              <>
                <NavItem
                  href="/dashboard/addcategoryform"
                  icon={FaDochub}
                  text="Designations"
                />
                <NavItem
                  href="/dashboard/staffadd"
                  icon={FaBaby}
                  text="Staff"
                />
              </>
            )}

            {menu?.includes("people") && (
              <NavItem
                href="/dashboard/members"
                icon={FaRegUser}
                text="Members Desk"
              />
            )}

            {menu?.includes("gallery") && (
              <NavItem
                href="/dashboard/galleryform"
                icon={FaClone}
                text="Gallery"
              />
            )}

            {menu?.includes("video-gallery") && (
              <NavItem
                href="/dashboard/video_gallery"
                icon={FaPhotoVideo}
                text="Video Gallery"
              />
            )}

            {menu?.includes("service") && (
              <NavItem
                href="/dashboard/serviceform"
                icon={FaServicestack}
                text="Services"
              />
            )}

            {menu?.includes("counter") && (
              <NavItem
                href="/dashboard/counters"
                icon={FaPoll}
                text="Counters"
              />
            )}

            {!menu?.includes("activity") && (
              <NavItem
                href="/dashboard/activity"
                icon={FaCalendar}
                text="Activities"
              />
            )}

            <NavItem
              href="/dashboard/contactus"
              icon={FaClipboardList}
              text="Contact"
            />

            {menu?.includes("faq") && (
              <NavItem
                href="/dashboard/faq"
                icon={FaQuestionCircle}
                text="Faq"
              />
            )}
            {menu?.includes("grievance") && (
              <NavItem
                href="/dashboard/grievance"
                icon={FaEnvelopeOpenText}
                text="Grievance"
              />
            )}

            <NavItem
              href="/dashboard/sociallink"
              icon={FaInstalod}
              text="Social Link"
            />
            <NavItem
              href="/dashboard/useful-links"
              icon={FaBookmark}
              text="Useful Links"
            />

            {/* ===== CITIZEN SECTION (ribbon) ===== */}
            <li className="nav-header citizen-ribbon">
              <FaUsers className="citizen-ribbon-icon" />
              <span>CITIZEN</span>
            </li>

            {citizenLinks.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                text={item.text}
              />
            ))}

            {/* Reports — collapsible */}
            <li className={`nav-item has-treeview ${reportsOpen ? "menu-open" : ""}`}>
              <a
                href="#"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setReportsOpen((prev) => !prev);
                }}
              >
                <FaFileAlt className="nav-icon" />
                <p>
                  Reports
                  <FaChevronDown
                    className={`report-caret ${reportsOpen ? "rotated" : ""}`}
                  />
                </p>
              </a>
              <ul
                className="nav nav-treeview"
                style={{ display: reportsOpen ? "block" : "none" }}
              >
                {reportLinks.map((r) => (
                  <li className="nav-item" key={r.href}>
                    <Link href={r.href} className="nav-link">
                      <FaCircle className="nav-icon" style={{ fontSize: "6px" }} />
                      <p>{r.text}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {citizenBottomLinks.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                text={item.text}
              />
            ))}

            <li className="nav-item d-none">
              <Link href="/dashboard/usermasterpage" className="nav-link">
                <FaCircle className="nav-icon" />
                <p>User Master Page</p>
              </Link>
            </li>

            <li className="nav-item d-none">
              <Link href="/dashboard/addrecipentform" className="nav-link">
                <FaCircle className="nav-icon" />
                <p>Add Recipient </p>
              </Link>
            </li>
            <li className="nav-item d-none">
              <Link href="/dashboard/sendsms" className="nav-link">
                <FaCircle className="nav-icon" />
                <p>Send Sms </p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <style jsx>{`
        .citizen-ribbon {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 18px 10px 10px 10px;
          padding: 8px 14px;
          background: linear-gradient(90deg, #007bff 0%, #0056d2 100%);
          border-radius: 6px;
          color: #fff !important;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 1px;
          box-shadow: 0 2px 6px rgba(0, 91, 210, 0.35);
          position: relative;
        }
        .citizen-ribbon::after {
          content: "";
          position: absolute;
          left: 14px;
          bottom: -6px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #003f96;
        }
        .citizen-ribbon-icon {
          font-size: 0.85rem;
        }
        .report-caret {
          float: right;
          margin-top: 4px;
          font-size: 0.65rem;
          transition: transform 0.2s ease;
        }
        .report-caret.rotated {
          transform: rotate(180deg);
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;