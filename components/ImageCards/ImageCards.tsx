import styles from "./ImageCards.module.scss";
import Container from "@/app/client-react-boostrap";

const ImageCards = () => {
  return (
    <Container>
      <div className={styles["flex-container"]}>
        <div className={styles["card-home-one"]}>
          <div className={styles["card-info-wrapper"]}>
            <div className={styles["title-wrapper-cards"]}>
              <h2>Search Massachusetts Homes!</h2>
            </div>
            <div className={styles["card-description"]}>
              <p>Browse MLS home listings now.</p>
            </div>
            {/* <span class="hover-text">
          Random new text added when hovering on card
        </span> */}
            <div className={styles["apply-btn"]}>
              <div
                className={styles["btn-cards"]}
                // onClick={() => {
                //   // return navigate("/buy");
                // }}
              >
                <span>ADVANCED SEARCH</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["card-home-two"]}>
          <div className={styles["card-info-wrapper"]}>
            <div className={styles["title-wrapper-cards"]}>
              <h2>List Your Home!</h2>
            </div>
            <div className={styles["card-description"]}>
              <p>Effortless Home Selling Experience</p>
            </div>
            <div className={styles["apply-btn"]}>
              <div className={styles["btn-cards"]}>
                <span>LIST YOUR HOME</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["card-home-three"]}>
          <div className={styles["card-info-wrapper"]}>
            <div className={styles["title-wrapper-cards"]}>
              <h2>We're Hiring!</h2>
            </div>
            <div className={styles["card-description"]}>
              <p>Unlock Your Real Estate Potential</p>
            </div>
            <div className={styles["apply-btn"]}>
              <div className={styles["btn-cards"]}>
                <span>APPLY TODAY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ImageCards;
