import styles from "./SearchButton.module.scss";
import { useTheme } from "next-themes";

export default function SearchButton(props: { onClick: () => void }) {
  const { resolvedTheme } = useTheme();
  return resolvedTheme ? (
    <div className={styles["search-btn"]}>
      <div
        className={
          resolvedTheme == "dark" ? styles["btn-map-dark"] : styles["btn-map"]
        }
        onClick={props.onClick}
      >
        <span>SEARCH HOMES</span>
      </div>
    </div>
  ) : null;
}
