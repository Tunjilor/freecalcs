import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The build date, inlined into server and client bundles. Calculators with
  // date inputs render their "today"-relative defaults from it so prerendered
  // HTML and hydration match; the browser then switches to the visitor's date.
  env: {
    FC_BUILD_DATE: new Date().toISOString().slice(0, 10),
  },
};

export default nextConfig;
