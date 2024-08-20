import fs from "fs";
import Filters from "@/components/Mlspin/Filters/Filters";

async function getCityListing(city: string) {
  let query = "";
  query += `City=${city}`; // ${city} -> previously!
  query += `&PropertyType=Residential,Residential Income`;
  query += "&save=true";
  const res: any = await fetch(
    `https://www.bostonharmonyhomes.com/api/search/mlspin?${query}&page=1`,
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

  return { properties: res.properties, pages: res.pages };
}

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}) {
  const city = params.city;
  const data = await fetch(
    `https://www.bostonharmonyhomes.com/api/search/mlspin?City=${city}&page=1&PropertyType=Residential,Residential Income`,
    { cache: "no-store" }
  ).then((res) => res.json());
  const totalAmountOfProperties = data.pages * 12;

  const title = `Boston Harmony Homes: ${totalAmountOfProperties} Properties for Sale in ${
    city.charAt(0).toUpperCase() + city.slice(1)
  }`;
  const description = `Explore ${totalAmountOfProperties} real estate listings in ${
    city.charAt(0).toUpperCase() + city.slice(1)
  } with Boston Harmony Homes. Buy or sell with market insights, detailed photos, and advanced filters.`;
  const url = `https://www.bostonharmonyhomes.com/search/city/${city}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        {
          url: "/logo.png", // Placeholder URL for now
          alt: `Real estate listings in ${
            city.charAt(0).toUpperCase() + city.slice(1)
          }`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@BostonHarmonyHomes", // Update with your Twitter handle
      title,
      description,
      image: "/logo.png", // Placeholder URL for now
    },
  };
}

export async function generateStaticParams() {
  const file = fs.readFileSync(
    process.cwd() + "/data/massachusetsCities.json",
    "utf8"
  );
  const data = JSON.parse(file);

  return data.map((city: any) => ({
    city: city.Name.toLowerCase(),
  }));
}

export default async function CityPage({
  params,
}: {
  params: { city: string };
}) {
  const city = params.city;
  const data = await getCityListing(city);

  return (
    <>
      <Filters cityData={data.properties} cityPages={data.pages} />
    </>
  );
}
