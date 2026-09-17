import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Workspace packages ship TypeScript source, so Next has to compile them.
  transpilePackages: ['@yc/ui', '@yc/markdown'],
};

export default nextConfig;
