"use client";

import Image from "@/node_modules/next/image";
import styles from "./page.module.scss";
import Banner from "@/components/Banner/Banner";
import Container from "@/node_modules/react-bootstrap/esm/Container";
import ImageCards from "@/components/ImageCards/ImageCards";
import CTA from "@/components/CTA/CTA";

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <Banner />

        <Container>
          <ImageCards />
          <div className={styles["title-wrapper"]}>
            <h2>Near You</h2>
            {/* <NearYouListings /> */}
          </div>
          <hr />
          <div className={styles["title-wrapper"]}>
            <h2 className={styles["title"]}>By the Water</h2>
            {/* <NewListings /> */}
          </div>
          <hr />
          <CTA />
        </Container>
      </main>
    </>
  );
}
