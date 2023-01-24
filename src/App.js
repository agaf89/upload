import styles from "./app.module.scss";
import { UploadButton } from "./components/UploadButton";
import { Button } from "./components/Button";

export function App() {
  const handleClick = (e) => {
    console.log(e);
  };
  const handleUpload = (e) => {
    console.log(e.target.files);
  };
  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <UploadButton />
      </div>
    </div>
  );
}
