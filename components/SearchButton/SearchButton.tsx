import styles from "./SearchButton.module.scss";

export default function SearchButton(props: { onClick: () => void }) {
  return (
    <div className={styles["search-btn"]}>
      <div className={styles["btn-cta"]} onClick={props.onClick}>
        <span>SEARCH HOMES</span>
      </div>
    </div>
  );
}
