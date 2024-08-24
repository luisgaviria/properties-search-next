import fs from "fs";
import Filters from "@/components/Mlspin/Filters/Filters";
import Script from "@/node_modules/next/script";

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

// Function to generate the property schema
function generatePropertySchema(properties: any[]) {
  return JSON.stringify({
    "@type": "RealEstateListing",
    name: "Real Estate Listings",
    offers: properties.map((tempProperty) => ({
      "@context": "https://schema.org",
      "@type": "Offer",
      "@id": `Offer${tempProperty.ListingId}`,
      price: `${tempProperty.ListPrice.toLocaleString()}`,
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
        name: `${tempProperty.StreetNumber}${tempProperty.StreetName}`,
        url: tempProperty.url,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${tempProperty.StreetNumber}${tempProperty.StreetName}`,
          addressLocality: tempProperty.City,
          addressRegion: tempProperty.StateOrProvince,
          addressCountry: "USA",
        },
        numberOfBedrooms: tempProperty.BedroomsTotal,
        numberOfBathroomsTotal: tempProperty.BathroomsTotalDecimal,
        floorSize: {
          "@type": "QuantitativeValue",
          value: tempProperty.LivingArea?.toLocaleString() || null,
          unitCode: "SQFT",
        },
      },
    })),
  });
}

const realEstateAgentSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": "RealEstateAgent",
  actionableFeedbackPolicy: "bostonharmonyhomes.com",
  additionalType: "bostonharmonyhomes.com",
  address: "62 Creshill Rd",
  alternateName: "Boston Harmony Homes",
  areaServed: "Greater Boston - Mass",
  description:
    "Sell your home with confidence at Harmony Homes. Access free real-time MLS listings and expert advice to reach the right buyers quickly and efficiently.",
  email: "Luis.aptx@gmail.com",
  foundingDate: "2024-07-15",
  hasMap: "bostonharmonyhomes.com",
  location: "Boston",
  legalName: "Harmony Homes",
  priceRange: "$1-$200000000",
  sameAs: "Bostonharmonyhomes.com",
  telephone: "+1 508-762-7639",
  tourBookingPage: "bostonharmonyhomes.com/search",
});

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

  const title = `${
    city.charAt(0).toUpperCase() + city.slice(1)
  }, MA Real Estate & Homes for Sale`;
  const description = `Discover ${totalAmountOfProperties} real estate opportunities in ${
    city.charAt(0).toUpperCase() + city.slice(1)
  }, MA with Boston Harmony Homes. Benefit from detailed photos, advanced filters, and expert market insights for buying or selling your property.`;
  const url = `https://www.bostonharmonyhomes.com/search/city/${city}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        {
          url: "/logo.png", // Placeholder URL for nowalt: `Real estate listings in
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
    canonical: url,
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

  // Generate the schema for the property listings
  const schema_listing = generatePropertySchema(data.properties);

  return (
    <>
      {/* Injecting the schema as JSON-LD */}
      <Script
        id="json-ld-agent"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: realEstateAgentSchema }}
        strategy="afterInteractive"
      />
      <Script
        id="json-ld-agent"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema_listing }}
        strategy="afterInteractive"
      />
      <Filters cityData={data.properties} cityPages={data.pages} />
    </>
  );
}
