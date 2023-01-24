import styles from "./styles.module.scss";
import { useRef } from "react";

export const ProgressBar = ({ percentage }) => {
  const ref = useRef(null);

  if (!percentage) {
    return null;
  }
  return (
    <div className={styles.ProgressBar}>
      <div ref={ref} style={{}} className={styles.percentage}>
        {percentage}%
      </div>
    </div>
  );
};
