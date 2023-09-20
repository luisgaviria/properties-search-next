import styles from "./Banner.module.scss";

import { Container } from "@/app/client-react-boostrap";
import Form from "./Form/Form";
import Image from "./Banner-Image/Image";

const Banner = () => {
  return (
    <>
      <div className={styles["home-full-width-image"]}>
        <Image
          priority
          className={styles["home-image"]}
          width={500}
          height={450}
          alt="Front yard of home image in banner background"
          src={"/top-banner-home.webp"}
        />
        <Container>
          <div className={styles["home-title-wrapper"]}>
            <h1>Harmony Homes</h1>
            <h2>Unlock the Door to Your Future Home</h2>
            <Form />
          </div>
        </Container>
      </div>
    </>
  );
};

export default Banner;
