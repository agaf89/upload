import styles from "./styles.module.scss";

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const Preview = ({ onDelete, image }) => {
  const { url, name, size } = image;

  return (
    <div className={styles.preview}>
      {image.ref && <span className={styles.badge}>В облаке</span>}
      <div className={styles.delete} onClick={() => onDelete(image)}>
        x
      </div>
      <div className={styles.wrapperImage}>
        <img className={styles.image} alt="2" src={url} />
      </div>

      <div className={styles.title}>{name}</div>

      <div style={{ textAlign: "end" }}>{formatBytes(size)}</div>
    </div>
  );
};
