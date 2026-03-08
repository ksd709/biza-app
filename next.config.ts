import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow @uiw packages to be transpiled
  transpilePackages: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
};

export default nextConfig;
