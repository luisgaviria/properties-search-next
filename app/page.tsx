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
    title: `Real-Time MLS Listings for Buyers and Sellers`,
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
      title: `Real-Time MLS Listings for Buyers and Sellers`,
      description: description,
      images: [{ url: newListings[0]?.[0]?.Media?.[0]?.MediaURL || "" }],
      url: `/`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Real-Time MLS Listings for Buyers and Sellers`,
      description: description,
      images: [{ url: newListings[0]?.[0]?.Media?.[0]?.MediaURL || "" }],
    },
  };
}

// Main server component
export default async function Home() {
  const newListings = await getLatestListings();
  const waterFrontListings = await getWaterFrontListings();
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
    telephone: "5087627639",
    tourBookingPage: "bostonharmonyhomes.com/search",
  });

  const schema_listing = JSON.stringify({
    "@type": "RealEstateListing",
    "@id": "RealEstateListing", // Unique ID for the listing
    name: "House for sale in Mass",
    offers: newListings
      .concat(waterFrontListings)
      .flatMap((propertyGroup, groupIndex) =>
        propertyGroup.map((tempProperty, index) => ({
          "@context": "https://schema.org",
          "@type": "Offer",
          "@id": `Offer${groupIndex * newListings.length + index + 1}`, // Unique ID for each offer
          additionalType: tempProperty.url, // Dynamically add more fields as needed
          price: formatPrice(tempProperty.ListPrice),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          businessFunction: "https://schema.org/SellAction",
          seller: {
            "@type": "RealEstateAgent",
            name: "Boston Harmony Homes.",
            url: "https://bostonharmonyhomes.com",
            telephone: "+1-508-762-7639",
          },
          itemOffered: {
            "@type": "RealEstateListing",
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
            numberOfBathrooms: tempProperty.BathroomsTotalDecimal,
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

  const listing_schema = `${schema_listing}`;

  return (
    <>
      <main className={styles.main}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: listing_schema }}
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

// const schema_listing = JSON.stringify({
//   "@context": "https://schema.org",
//   "@type": "RealEstateListing",
//   newListings
//       .concat(waterFrontListings)
//       .flatMap((propertyGroup, groupIndex) =>
//         propertyGroup.map((tempProperty, index) => ({
//           "@type": "ListItem",
//           position: groupIndex * newListings.length + index + 1,
//           item: {
//             "@type": "RealEstateListing",
//             name:
//               `${tempProperty.StreetNumber} ${tempProperty.StreetName}` || "", // Add Property Name if available
//             url: tempProperty.url,
//             address: {
//               "@type": "PostalAddress",
//               streetAddress: `${tempProperty.StreetNumber} ${tempProperty.StreetName}`,
//               addressLocality: tempProperty.City,
//               addressRegion: tempProperty.StateOrProvince,
//               addressCountry: "USA",
//             },
//             price: formatPrice(tempProperty.ListPrice),
//             numberOfBedrooms: tempProperty.BedroomsTotal,
//             numberOfBathrooms: tempProperty.BathroomsTotalDecimal,
//             floorSize: {
//               "@type": "QuantitativeValue",
//               value:
//                 tempProperty.LivingArea && tempProperty.LivingArea !== 0
//                   ? tempProperty.LivingArea.toLocaleString()
//                   : null,
//               unitCode: "SQFT",
//             },
//           },
//         }))
//       ),
//   name: `House for sale in `,
//   description:
//     "This stunning 4-bedroom waterfront house in Miami offers luxury living with breathtaking views of the ocean. Close to schools, parks, and shopping centers.",
//   url: "https://example.com/listing/beautiful-waterfront-house-miami",
//   datePosted: "2024-08-14T12:00:00Z",
//   offers: {
//     "@type": "Offer",
//     price: "1200000",
//     priceCurrency: "USD",
//     availability: "https://schema.org/InStock",
//     itemCondition: "https://schema.org/NewCondition",
//     businessFunction: "https://schema.org/SellAction",
//     seller: {
//       "@type": "RealEstateAgent",
//       name: "Miami Realty Co.",
//       url: "https://miamirealtyco.com",
//       telephone: "+1-305-555-0123",
//     },
//   },
//   mainContentOfPage: {
//     "@type": "WebPageElement",
//     headline: "Luxury Waterfront Living in Miami",
//     primaryImageOfPage: {
//       "@type": "ImageObject",
//       url: "https://example.com/images/miami-waterfront-house.jpg",
//       caption: "Stunning waterfront house in Miami",
//     },
//   },
//   leaseLength: "P0Y6M",
//   breadcrumb: {
//     "@type": "BreadcrumbList",
//     itemListElement: [
//       {
//         "@type": "ListItem",
//         position: 1,
//         name: "Home",
//         item: "https://example.com/",
//       },
//       {
//         "@type": "ListItem",
//         position: 2,
//         name: "Listings",
//         item: "https://example.com/listings",
//       },
//       {
//         "@type": "ListItem",
//         position: 3,
//         name: "Waterfront Houses",
//         item: "https://example.com/listings/waterfront",
//       },
//     ],
//   },
//   specialty: "Waterfront Properties",
//   dateModified: "2024-08-14T12:00:00Z",
//   reviewedBy: {
//     "@type": "Person",
//     name: "Luis C.",
//     jobTitle: "Real Estate Expert",
//     worksFor: {
//       "@type": "Organization",
//       name: "Luis Realty Group",
//     },
//   },
//   keywords: "waterfront, luxury, house, Miami, ocean view, for sale",
//   publisher: {
//     "@type": "Organization",
//     name: "Miami Realty Co.",
//     url: "https://miamirealtyco.com",
//   },
// });
