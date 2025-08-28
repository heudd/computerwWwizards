import { NextConfig , } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  define: {
    HELLO: 'world',
    'hello.world': 'hello'
  },
  typescript:{
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
