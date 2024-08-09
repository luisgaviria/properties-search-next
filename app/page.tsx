import styles from "./page.module.scss";
import Banner from "@/components/Banner/Banner";
import { Container } from "./client-react-boostrap";
import ImageCards from "@/components/ImageCards/ImageCards";
import CTA from "@/components/CTA/CTA";
import LatestListings from "@/components/LatestListings/LatestListings";
import WaterFrontListings from "@/components/WaterFrontListings/WaterFrontListings";
import { Suspense } from "react";
import Loading from "./loading";
import { Property } from "@/components/definitions/Property";
import { formatPrice } from "@/utils/formatPrice";
import { Metadata } from "next";
import { PropertyDetails } from "../components/definitions/PropertyDetails";

interface latestResponse {
  message: string;
  listings: Property[][];
}

interface waterFrontResponse {
  message: string;
  waterFrontListings: Property[][];
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}): Promise<Metadata> {
  const id = params.id;

  const newListings = await getLatestListings();
  const waterFrontListings = await getWaterFrontListings();
  const totalListings = newListings?.length + waterFrontListings?.length;
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

async function getLatestListings() {
  // url in env! should be solved in case of deployment!
  const res: latestResponse = await fetch(
    `${
      process.env.NEXT_PUBLIC_URL_API && process.env.PORT
        ? `${process.env.NEXT_PUBLIC_URL_API}:${
            process.env.PORT || 3000
          }/api/search/mlspin/latest`
        : `https://properties-search-next.vercel.app/api/search/mlspin/latest`
    }`
  ).then((data) => data.json());
  return res.listings;
}

async function getWaterFrontListings() {
  const res: waterFrontResponse = await fetch(
    `${
      process.env.NEXT_PUBLIC_URL_API && process.env.PORT
        ? `${process.env.NEXT_PUBLIC_URL_API}:${
            process.env.PORT || 3000
          }/api/search/mlspin/waterFrontListings`
        : `https://properties-search-next.vercel.app/api/search/mlspin/waterFrontListings`
    }`
  ).then((data) => data.json());
  return res.waterFrontListings;
}

const generateTitle = (state: any) => {
  const livingArea =
    state.LivingArea !== null ? state.LivingArea?.toLocaleString() : null;

  return `Property Listing: ${state.StreetNumber} ${state.StreetName}, ${
    state.City
  }, ${state.StateOrProvince} - ${formatPrice(state.ListPrice)} - ${
    livingArea !== null ? livingArea + " sqft" : ""
  }`;
};

function truncateStringWithEllipsis(str: string) {
  const maxLength = 157;

  if (typeof str !== "string") {
    throw new Error("Input must be a string.");
  }

  if (!str || str.trim() === "") {
    return "";
  }

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - 3) + "...";
}

export default async function Home() {
  const newListings = await getLatestListings();
  const waterFrontListings = await getWaterFrontListings();

  console.log(newListings, waterFrontListings);

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
          "numberOfItems": ${newListings?.length + waterFrontListings?.length},
          "itemListElement": [
          ${newListings
            ?.concat(waterFrontListings)
            ?.map((property, index) =>
              property?.map(
                (tempProperty, index) => `
          {
          "@type": "ListItem",
          "position": ${index + 1},
          "item": {
          "@type": "RealEstateListing",
          "name": "${generateTitle(tempProperty)}",
          "image": "${
            tempProperty?.Media?.length && tempProperty.Media[0].MediaURL
          }",
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
            tempProperty.LivingArea !== undefined &&
            tempProperty.LivingArea !== 0
              ? `"${tempProperty.LivingArea.toLocaleString()}"`
              : null
          },
          "unitCode": "SQFT"
          }
          }
          `
              )
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
            <Suspense fallback={<Loading />}>
              <LatestListings listings={newListings} />
            </Suspense>
          </div>
          <hr />
          <div className={styles["title-wrapper"]}>
            <h2 className={styles["title"]}>By the Water</h2>
            <Suspense fallback={<Loading />}>
              <WaterFrontListings listings={waterFrontListings} />
            </Suspense>
          </div>
          <hr />
          <CTA pageName={"test"} />
        </Container>
      </main>
    </>
  );
}
