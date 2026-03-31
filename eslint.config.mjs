import nextConfig from "eslint-config-next";
import nextCoreWebVitalsConfig from "eslint-config-next/core-web-vitals";
import nextTypescriptConfig from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextConfig,
  ...nextCoreWebVitalsConfig,
  ...nextTypescriptConfig,
];

export default eslintConfig;
