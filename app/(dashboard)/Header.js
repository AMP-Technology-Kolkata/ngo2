"use client";
import axios from "axios";
import {
  FaBars,
  FaSearch,
  FaComments,
  FaBell,
  FaStar,
  FaUser,
  FaClock,
  FaThLarge,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKLINK}/users/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <FaBars />
          </a>
        </li>
      </ul>

      <form className="form-inline ml-3">
        <div className="input-group input-group-sm">
          <input
            className="form-control form-control-navbar"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <div className="input-group-append">
            <button className="btn btn-navbar" type="submit">
              <FaSearch />
            </button>
          </div>
        </div>
      </form>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <FaComments />
            <span className="badge badge-danger navbar-badge">3</span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <a href="#" className="dropdown-item">
              <div className="media">
                <FaUser className="img-size-50 mr-3 img-circle" />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    Brad Diesel
                    <span className="float-right text-sm text-danger">
                      <FaStar />
                    </span>
                  </h3>
                  <p className="text-sm">Call me whenever you can...</p>
                  <p className="text-sm text-muted">
                    <FaClock /> 4 Hours Ago
                  </p>
                </div>
              </div>
            </a>
            <div className="dropdown-divider"></div>
            {/* Add other message items here */}
            <a href="#" className="dropdown-item dropdown-footer">
              See All Messages
            </a>
          </div>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
