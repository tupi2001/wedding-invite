import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // Turbopack config (Next.js 16+ uses Turbopack by default)
  turbopack: {},
  // Webpack config for fallback (if needed)
  webpack: (config) => {
    // Ensure modules resolve from the project directory, not parent
    const projectRoot = path.resolve(__dirname);
    const projectNodeModules = path.resolve(projectRoot, "node_modules");
    
    // Set resolve modules to ONLY use project node_modules first
    if (!config.resolve) {
      config.resolve = {};
    }
    
    // Override modules array to prioritize project node_modules
    config.resolve.modules = [projectNodeModules];
    
    // Also set resolveLoader to use project node_modules
    if (!config.resolveLoader) {
      config.resolveLoader = {};
    }
    config.resolveLoader.modules = [projectNodeModules];
    
    // Ensure context is set to project root
    config.context = projectRoot;
    
    return config;
  },
};

export default nextConfig;
