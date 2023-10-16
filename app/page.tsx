import Image from "@/node_modules/next/image";
import styles from "./page.module.scss";
import Banner from "@/components/Banner/Banner";
import { Container } from "./client-react-boostrap";
import ImageCards from "@/components/ImageCards/ImageCards";
import CTA from "@/components/CTA/CTA";
import LatestListings from "@/components/LatestListings/LatestListings";
import WaterFrontListings from "@/components/WaterFrontListings/WaterFrontListings";

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <Banner />

        <Container>
          <ImageCards />
          <div className={styles["title-wrapper"]}>
            <h2>Latest</h2>
            <LatestListings/>
          </div>
          <hr />
          <div className={styles["title-wrapper"]}>
            <h2 className={styles["title"]}>By the Water</h2>
            <WaterFrontListings/>
            {/* <NewListings /> */}
          </div>
          <hr />
          <CTA pageName={"test"}/>
        </Container>
      </main>
    </>
  );
}
