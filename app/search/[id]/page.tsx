import { PropertyDetails } from "@/components/definitions/PropertyDetails";
import { formatPrice } from "@/utils/formatPrice";
import { Metadata } from "next";
import SinglePropertyBuy from "@/components/SinglePropertySearchBody/SinglePropertySearchBody";

// Function to truncate strings
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

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}): Promise<Metadata> {
  const id = params.id;

  const data: PropertyDetails = await fetch(
    process.env.VERCEL_URL
      ? `https://properties-search-next.vercel.app/api/search/mlspin/${id}`
      : `http://localhost:3000/api/search/mlspin/${id}`,
    { cache: "no-store" }
  ).then((res) => res.json());

  const imageUrls = data.property.Media?.map((img: any) => img.MediaURL) || [];
  const filteredImageUrls = imageUrls.filter(
    (url: any) => url && typeof url === "string"
  );

  // Generate the title dynamically
  const generateTitle = () => {
    const livingArea =
      data.property.BuildingAreaTotal !== null
        ? data.property.BuildingAreaTotal.toLocaleString()
        : null;

    return `House for Sale: ${data.property.UnparsedAddress} - ${formatPrice(
      data.property.ListPrice
    )} - ${livingArea !== null ? livingArea + " sqft" : ""}`;
  };

  const publicRemarks = data.property.PublicRemarks || "";
  const description =
    publicRemarks.trim() !== ""
      ? truncateStringWithEllipsis(publicRemarks)
      : "Explore this property in detail.";

  console.log("NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL);

  return {
    title: generateTitle(),
    description: description,
    metadataBase: new URL(
      process.env.VERCEL_URL
        ? `https://properties-search-next.vercel.app/`
        : `http://localhost:3000/`
    ),
    alternates: {
      canonical: `/buy/${id}`,
    },
    openGraph: {
      title: generateTitle(),
      description: description,
      images: [{ url: filteredImageUrls[0] || "" }],
      url: `/buy/${id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: generateTitle(),
      description: description,
      images: [{ url: filteredImageUrls[0] || "" }],
    },
  };
}

export default function PageSinglePropertyBuy() {
  return <SinglePropertyBuy />;
}
