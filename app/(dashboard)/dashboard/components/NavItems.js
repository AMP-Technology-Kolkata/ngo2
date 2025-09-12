"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NavItem = ({ href, icon: Icon, text = "Nav Link" }) => {
  // Check if the current pathname matches the href
  const isActive = usePathname() === href;

  return (
    <li className={"nav-item"}>
      <Link href={href} className={`nav-link ${isActive ? "active" : ""}`}>
        <Icon className="nav-icon" />
        <p>{text}</p>
      </Link>
    </li>
  );
};

export default NavItem;
