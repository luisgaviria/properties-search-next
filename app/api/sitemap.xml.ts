// pages/api/sitemap.xml.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

async function getCityList() {
  const filePath = path.join(process.cwd(), "data/massachusettsCities.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const cities = JSON.parse(fileContent);
  return cities.map((city: any) => city.Name.toLowerCase());
}

export async function getServerSideProps(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cities = await getCityList();

  // Define static pages
  const staticPages = ["/", "/search"];

  // Create sitemap entries for all pages
  const allPages = [
    ...staticPages,
    ...cities.map((city: any) => `/search/city/${city}`),
  ];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages
        .map(
          (url) => `
        <url>
          <loc>${`https://www.bostonharmonyhomes.com${url}`}</loc>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `
        )
        .join("")}
    </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
}

export default getServerSideProps;
