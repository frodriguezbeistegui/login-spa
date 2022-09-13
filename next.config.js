/** @type {import('next').NextConfig} */
const nextConfig = {
  source:'http://localhost:8080',
  destination: 'http://localhost:8080',
    reactStrictMode: true,
    swcMinify: true,
    
};

module.exports = nextConfig;
