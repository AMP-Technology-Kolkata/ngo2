/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "office-backend.amptechnology.in",
        port: "",
        // pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cdn.amptechnology.in",
        port: "",
      },
      {
        hostname: "localhost",
        protocol: "http",
      },
    ],
  },
};

export default nextConfig;
