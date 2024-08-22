import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';

export async function GET(req: NextRequest) {
    const file = await fs.readFile(process.cwd() + '/data/massachusetsCities.json', 'utf8');  
    const data = JSON.parse(file);
    // Fetch all cities dynamically from your database or an external API
    const cities =  data.map((city: any) => city.Name); // Example static cities, replace with your dynamic city fetching logic.
  
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${cities
          .map((city: any) => {
            return `
              <url>
                <loc>https://www.bostonharmonyhomes.com/search/city/${city.toLowerCase()}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.8</priority>
              </url>
            `;
          })
          .join('')}
            <url>
                <loc>https://www.bostonharmonyhomes.com/search</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.8</priority>
            </url>
            <url>
                <loc>https://www.bostonharmonyhomes.com/</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.8</priority>
            </url>
      </urlset>
    `;

    return new Response(sitemap, { headers: { "Content-Type": "text/xml" } });   
  }
  