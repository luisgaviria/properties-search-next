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
  const description = `Sell your home fast with Boston Harmony Homes. Explore free real-time real estate listings and expert tips to connect with the right buyers efficiently.`;
  const title = "Real Estate, Homes for Sale | Boston Harmony Homes";

  return {
    title: title,
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
      title: title,
      description: description,
      images: [{ url: newListings[0]?.[0]?.Media?.[0]?.MediaURL || "" }],
      url: `/`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [{ url: newListings[0]?.[0]?.Media?.[0]?.MediaURL || "" }],
    },
  };
}

// Main server component
export default async function Home() {
  const newListings = await getLatestListings();
  const waterFrontListings = await getWaterFrontListings();

  newListings.map((propertyGroup: any, groupIndex: any) =>
    propertyGroup.map((tempProperty: any, index: any) => {
      console.log("TEMP:::", tempProperty);
    })
  );
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "RealEstateAgent",
    actionableFeedbackPolicy: "bostonharmonyhomes.com",
    additionalType: "bostonharmonyhomes.com",
    address: "62 Creshill Rd",
    alternateName: "Boston Harmony Homes",
    areaServed: "Greater Boston - Mass",
    description:
      "Sell your home with confidence at Harmony Homes. Access free real-time MLS listings and expert advice to reach the right buyers quickly and efficiently",
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

  const schema_listing = JSON.stringify({
    "@type": "RealEstateListing",
    name: "House for sale in Mass",
    offers: newListings
      .concat(waterFrontListings)
      .flatMap((propertyGroup, groupIndex) =>
        propertyGroup.map((tempProperty, index) => ({
          "@context": "https://schema.org",
          "@type": "Offer",
          "@id": `Offer${tempProperty.ListingId}`,
          price: formatPrice(tempProperty.ListPrice),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          businessFunction: "https://schema.org/SellAction",
          seller: {
            "@type": "RealEstateAgent",
            name: "Boston Harmony Homes.",
            url: "https://bostonharmonyhomes.com",
            telephone: "+1-508-762-7639",
          },
          itemOffered: {
            "@type": "House", // House schema added
            name:
              `${tempProperty.StreetNumber} ${tempProperty.StreetName}` || "",
            url: tempProperty.url,
            address: {
              "@type": "PostalAddress",
              streetAddress: `${tempProperty.StreetNumber} ${tempProperty.StreetName}`,
              addressLocality: tempProperty.City,
              addressRegion: tempProperty.StateOrProvince,
              addressCountry: "USA",
            },
            numberOfBedrooms: tempProperty.BedroomsTotal,
            numberOfBathroomsTotal: tempProperty.BathroomsTotalDecimal,
            floorSize: {
              "@type": "QuantitativeValue",
              value:
                tempProperty.LivingArea && tempProperty.LivingArea !== 0
                  ? tempProperty.LivingArea.toLocaleString()
                  : null,
              unitCode: "SQFT",
            },
          },
        }))
      ),
  });

  return (
    <>
      <main className={styles.main}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema_listing }}
        />
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
