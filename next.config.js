/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
dotenv.config();
const nextConfig = {
  reactStrictMode: false,
  env: {
    // API_URL: "http://localhost:8080/api",
    API_URL: "https://majestic-truck-production.up.railway.app/api",
  },
};

module.exports = nextConfig;
