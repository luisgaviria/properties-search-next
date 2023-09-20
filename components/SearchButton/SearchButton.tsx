import styles from "./SearchButton.module.scss";

export default function SearchButton() {
  return (
    <div className={styles["search-btn"]}>
      <div
        className={styles["btn-cta"]}
        // onClick={() => getData(1)}
      >
        <span>SEARCH HOMES</span>
      </div>
    </div>
  );
}
