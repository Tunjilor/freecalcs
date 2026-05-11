import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://www.freecalcs.io/sitemap.xml",
    host: "https://www.freecalcs.io",
  };
}
