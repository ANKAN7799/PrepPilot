import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    // this function just ignore minor warnings during the build of a application on Vercel related to eslint
    eslint:{
        ignoreDuringBuilds: true,
    },
    //this function just ignore minor warnings during the build of a application on Vercel related to typescript
     typescript:{
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
