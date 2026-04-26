import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, '../../'),
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE_PATH}/api/:path*`, // Proxy to backend server
      }
    ]
  }
};

export default nextConfig;
