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
} from "react-icons/fa";
import NavItem from "./dashboard/components/NavItems";

function Sidebar() {
  const [menu, setMenu] = useState([]);
  const [officeName, setofficeName] = useState("");

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
    </aside>
  );
}

export default Sidebar;
