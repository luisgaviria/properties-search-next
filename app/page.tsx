// Import necessary modules and components
import styles from "./page.module.scss";
import Banner from "@/components/Banner/Banner";
import { Container } from "./client-react-boostrap";
import ImageCards from "@/components/ImageCards/ImageCards";
import CTA from "@/components/CTA/CTA";
import LatestListings from "@/components/LatestListings/LatestListings";
import WaterFrontListings from "@/components/WaterFrontListings/WaterFrontListings";
import { Property } from "@/components/definitions/Property";
import { formatPrice } from "@/utils/formatPrice";
import { Metadata } from "next";

// Define data fetching functions
async function getLatestListings(): Promise<Property[][]> {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_URL_API && process.env.PORT
        ? `${process.env.NEXT_PUBLIC_URL_API}:${
            process.env.PORT || 3000
          }/api/search/mlspin/latest`
        : `https://properties-search-next.vercel.app/api/search/mlspin/latest`
    }`
  );
  const data = await res.json();
  return data.listings;
}

async function getWaterFrontListings(): Promise<Property[][]> {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_URL_API && process.env.PORT
        ? `${process.env.NEXT_PUBLIC_URL_API}:${
            process.env.PORT || 3000
          }/api/search/mlspin/waterFrontListings`
        : `https://properties-search-next.vercel.app/api/search/mlspin/waterFrontListings`
    }`
  );
  const data = await res.json();
  return data.waterFrontListings;
}

// Define metadata
export async function generateMetadata(): Promise<Metadata> {
  const newListings = await getLatestListings();
  const waterFrontListings = await getWaterFrontListings();
  const description = `Sell your home with confidence at Harmony Homes. Access free real-time MLS listings and expert advice to reach the right buyers quickly and efficiently.`;

  return {
    title: `Harmony Homes: Real-Time MLS Listings for Buyers and Sellers`,
    description: description,
    metadataBase: new URL(
      process.env.VERCEL_URL
        ? `https://www.bostonharmonyhomes.com`
        : `http://localhost:3000`
    ),
    alternates: {
      canonical: `/`,
    },
    openGraph: {
      title: `Harmony Homes: Real-Time MLS Listings for Buyers and Sellers`,
      description: description,
      images: [{ url: newListings[0]?.[0]?.Media?.[0]?.MediaURL || "" }],
      url: `/`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Harmony Homes: Real-Time MLS Listings for Buyers and Sellers`,
      description: description,
      images: [{ url: newListings[0]?.[0]?.Media?.[0]?.MediaURL || "" }],
    },
  };
}

// Main server component
export default async function Home() {
  const newListings = await getLatestListings();
  const waterFrontListings = await getWaterFrontListings();

  return (
    <>
      <script type="application/ld+json">
        {newListings?.length &&
          waterFrontListings?.length &&
          `
    {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": "Home Page",
      "description": "Sell your home with confidence at Harmony Homes. Access free real-time MLS listings and expert advice to reach the right buyers quickly and efficiently.",
      "numberOfItems": ${newListings.length + waterFrontListings.length},
      "itemListElement": [
        ${newListings
          .concat(waterFrontListings)
          .map((propertyGroup, groupIndex) =>
            propertyGroup
              .map(
                (tempProperty, index) => `
        {
          "@type": "ListItem",
          "position": ${groupIndex * newListings.length + index + 1},
          "item": {
            "@type": "RealEstateListing",
            "name": "",
            "url": "${tempProperty.url}",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "${tempProperty.StreetNumber} ${
                  tempProperty.StreetName
                }",
              "addressLocality": "${tempProperty.City}",
              "addressRegion": "${tempProperty.StateOrProvince}",
              "addressCountry": "USA"
            },
            "price": "${formatPrice(tempProperty.ListPrice)}",
            "numberOfBedrooms": "${tempProperty.BedroomsTotal}",
            "numberOfBathrooms": "${tempProperty.BathroomsTotalDecimal}",
            "floorSize": {
              "@type": "QuantitativeValue",
              "value": ${
                tempProperty.LivingArea && tempProperty.LivingArea !== 0
                  ? `"${tempProperty.LivingArea.toLocaleString()}"`
                  : null
              },
              "unitCode": "SQFT"
            }
          }
        }`
              )
              .join(",")
          )
          .join(",")}
      ]
    }
    `}
      </script>

      <main className={styles.main}>
        <Banner />

        <Container>
          <ImageCards />
          <div className={styles["title-wrapper"]}>
            <h2>New Listings</h2>
            <LatestListings listings={newListings} />
          </div>
          <hr />
          <div className={styles["title-wrapper"]}>
            <h2 className={styles["title"]}>By the Water</h2>
            <WaterFrontListings listings={waterFrontListings} />
          </div>
          <hr />
          <CTA pageName={"test"} />
        </Container>
      </main>
    </>
  );
}
