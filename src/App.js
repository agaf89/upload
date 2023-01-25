import styles from "./app.module.scss";
import { Upload } from "./components/Upload";

export function App() {
  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <Upload />
      </div>
    </div>
  );
}
