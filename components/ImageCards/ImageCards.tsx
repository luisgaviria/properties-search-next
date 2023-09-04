import styles from "./ImageCards.module.scss";

const ImageCards = () => {
  return (
    <div className={styles["flex-container"]}>
      <div className={styles["card-home card1"]}>
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
              onClick={() => {
                // return navigate("/buy");
              }}
            >
              <span>ADVANCED SEARCH</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["card-home card2"]}>
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
      <div className={styles["card-home card3"]}>
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
  );
};

export default ImageCards;