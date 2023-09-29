/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
dotenv.config();
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: "http://localhost:8080/api",
  },
};

module.exports = nextConfig;
