/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    domains: ["api.microlink.io"],
  },
};

export default nextConfig;
