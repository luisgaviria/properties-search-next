import styles from "./Banner.module.scss";

import Container from "@/app/client-react-boostrap";
import Form from "./Form/form";

const Banner = () => {
  return (
    <>
      <div className={styles["home-full-width-image"]}>
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
