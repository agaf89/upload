import styles from "./styles.module.scss";

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const Preview = ({ url, onDelete, title, size }) => {
  return (
    <div className={styles.preview}>
      <div className={styles.delete} onClick={() => onDelete(url)}>
        x
      </div>
      <img
        className={styles.image}
        width="100%"
        height="100%"
        alt="2"
        src={url}
      />

      <div className={styles.title}>{title}</div>

      <div>{formatBytes(size)}</div>
    </div>
  );
};