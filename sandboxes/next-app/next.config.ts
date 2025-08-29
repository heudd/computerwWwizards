import { NextConfig , } from "next";
import { withDefineConfig } from '@computerwwwizards/next-define-hof'

const nextConfig: ()=>Promise<NextConfig> = ()=> withDefineConfig({
  /* config options here */
  compiler:{
    define: {
    'process.env.custom': '1',
  }},
  typescript:{
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}, {
  globalOptions: {
    initialValues: {
      env2: 3
    }
  }
});

export default nextConfig;
