import styles from "./styles.module.scss";
import { useRef } from "react";

export const ProgressBar = ({ percentage }) => {
  const ref = useRef(null);

  if (!percentage) {
    return null;
  }

  return (
    <div className={styles.ProgressBar}>
      <span>{Math.floor(percentage)}%</span>
      <div
        ref={ref}
        style={{ width: percentage + "%" }}
        className={styles.percentage}
      ></div>
    </div>
  );
};
