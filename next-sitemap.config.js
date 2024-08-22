const fs = require("fs/promises")

module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bostonharmonyhomes.com',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.8,
    sitemapSize: 5000,
    exclude: ['/admin/*'],

    additionalPaths: async (config) => {
      const file = await fs.readFile(process.cwd() + '/data/massachusetsCities.json', 'utf8');  
      const data = JSON.parse(file);

      const cities = data.map(city => city.Name); 
      return cities.map(city => ({
        loc: `/search/city/${city.toLowerCase()}`,
        changefreq: 'daily',
        priority: 0.8,
      }));
    },
  };