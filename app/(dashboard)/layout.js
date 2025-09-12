"use client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKLINK}/dashboard/auth`,
        {
          withCredentials: true,
        }
      );

      if (res.status < 200 || res.status >= 300) {
        throw new Error("Unauthorized");
      }
    } catch (error) {
      // Redirect to login page if there's an error
      router.push("/login");
    }
  };

  return (
    <>
      <html>
        <head>
          {/* <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script> */}
          {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"></script> */}
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css"
            integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
            crossOrigin="anonymous"
          ></link>
        </head>
        <body className="sidebar-mini layout-fixed">
          <div className="wrapper">
            <Header />
            <Sidebar />
            <div className="content-wrapper">{children}</div>
          </div>

          <script
            src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
            integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
            crossOrigin="anonymous"
            defer
          ></script>
          <script
            src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js"
            integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
            crossOrigin="anonymous"
            defer
          ></script>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js"
            integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
            crossOrigin="anonymous"
            defer
          ></script>
          <script
            src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"
            defer
          ></script>
        </body>
      </html>
    </>
  );
}
