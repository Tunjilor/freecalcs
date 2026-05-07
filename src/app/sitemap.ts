import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.freecalcs.io";
  const pages = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/mortgage", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/qualify", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/rent-vs-buy", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/salary", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/tax", priority: 0.8, changeFrequency: "yearly" as const },
    { url: "/bmi", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/tdee", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/compound-interest", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/loan", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/tip", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/age", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/percentage", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  return pages.map((page) => ({
    url: `${base}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
