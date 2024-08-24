import fs from "fs";
import Filters from "@/components/Mlspin/Filters/Filters";
import Script from "next/script"; // Importing the Script component

async function getCityListing(city: string) {
  let query = "";
  query += `City=${city}`;
  query += `&PropertyType=Residential,Residential Income`;
  query += "&save=true";

  await new Promise((r) => setTimeout(r, 500));
  const res: any = await fetch(
    `https://www.bostonharmonyhomes.com/api/search/mlspin?${query}&page=1`,
    { cache: "no-store" }
  ).then((res) => res.json());

  return { properties: res.properties, pages: res.pages };
}

function generatePropertySchema(properties: any[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: "Real Estate Listings",
    offers: properties.map((tempProperty) => ({
      "@type": "Offer",
      "@id": `#Offer${tempProperty.ListingId}`,
      price: tempProperty.ListPrice.toLocaleString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      businessFunction: "https://schema.org/SellAction",
      seller: {
        "@type": "RealEstateAgent",
        name: "Boston Harmony Homes",
        url: "https://bostonharmonyhomes.com",
        telephone: "+1-508-762-7639",
      },
      itemOffered: {
        "@type": "House",
        name: `${tempProperty.StreetNumber} ${tempProperty.StreetName}`,
        url: tempProperty.url,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${tempProperty.StreetNumber} ${tempProperty.StreetName}`,
          addressLocality: tempProperty.City,
          addressRegion: tempProperty.StateOrProvince,
          postalCode: tempProperty.PostalCode,
          addressCountry: "USA",
        },
        numberOfBedrooms: tempProperty.BedroomsTotal,
        numberOfBathroomsTotal: tempProperty.BathroomsTotalDecimal,
        floorSize: {
          "@type": "QuantitativeValue",
          value: tempProperty.LivingArea?.toLocaleString() || null,
          unitCode: "SQFT",
        },
        image: tempProperty.Media?.[0]?.MediaURL || "",
      },
    })),
  });
}

export default async function CityPage({
  params,
}: {
  params: { city: string };
}) {
  const city = params.city;
  const data = await getCityListing(city);

  const schema_listing = generatePropertySchema(data.properties);

  return (
    <>
      {/* Injecting the schema as JSON-LD using Next.js Script */}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema_listing }}
        strategy="afterInteractive" // Ensures the script is loaded after the page is interactive
      />
      <Filters cityData={data.properties} cityPages={data.pages} />
    </>
  );
}
