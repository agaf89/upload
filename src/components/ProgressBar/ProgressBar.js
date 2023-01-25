import styles from "./styles.module.scss";

export const ProgressBar = ({ percentage }) => {
  if (!percentage) {
    return null;
  }

  return (
    <div className={styles.ProgressBar}>
      <span>{Math.floor(percentage)}%</span>
      <div
        style={{ width: percentage + "%" }}
        className={styles.percentage}
      ></div>
    </div>
  );
};
