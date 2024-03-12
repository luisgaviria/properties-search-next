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

interface latestResponse {
  message: string;
  listings: Property[][];
}

interface waterFrontResponse {
  message: string;
  waterFrontListings: Property[][]
}

async function getLatestListings(){ // url in env! should be solved in case of deployment!
  const res: latestResponse = await fetch("http://localhost:3000/api/search/mlspin/latest").then(data=>data.json());
  return res.listings;
}

async function getWaterFrontListings(){
  const res: waterFrontResponse = await fetch("http://localhost:3000/api/search/mlspin/waterFrontListings").then(data=>data.json());
  return res.waterFrontListings;
}

export default async function Home() {
  const newListings = await getLatestListings();
  const waterFrontListings = await getWaterFrontListings();
  return (
    <>
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
