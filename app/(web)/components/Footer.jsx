import { FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

export default function Footer({ data = {}, links = {}, bg = "" }) {
  return (
    <footer
      id="footer"
      style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKPUBLIC}/${bg?.slice(7)})`,
      }}
    >
      <div className="container">
        <div className="social-links fixed-right">
          {links?.facebook && (
            <a href={links?.facebook} target="_blank">
              <FaFacebook />
            </a>
          )}
          {links?.twitter && (
            <a href={links?.twitter} target="_blank">
              <FaTwitter />
            </a>
          )}
          {links?.instagram && (
            <a href={links?.instagram} target="_blank">
              <FaInstagram />
            </a>
          )}
          {links?.linkedin && (
            <a href={links?.linkedin} target="_blank">
              <FaLinkedin />
            </a>
          )}
          {links?.youtube && (
            <a href={links?.youtube} target="_blank">
              <FaYoutube />
            </a>
          )}
        </div>
        <h3>{data?.name}</h3>
        <div className="footer-links font-weight-bold" style={{ fontSize: "17px" }}>
          {data?.enabled_services?.includes("faq") && (
            <a style={{ color: "#fff", textDecoration: "none" }} href="/faq">
              FAQ
            </a>
          )}
          {" | "}
          {data?.enabled_services?.includes("grievance") && (
            <a style={{ color: "#fff", textDecoration: "none" }} href="/grievance">
              Grievance
            </a>
          )}
        </div>

        <hr />
        <div className="copyright">
          &copy; Copyright{" "}
          <strong>
            <span>{data?.name}</span>
          </strong>
          . All Rights Reserved
        </div>
        <div className="credits">
          Designed by{" "}
          <a style={{ fontSize: "15px", textDecoration: "none" }} href="https://amptechnology.in">
            AmpTechnology
          </a>
        </div>
      </div>
    </footer>
  );
}
