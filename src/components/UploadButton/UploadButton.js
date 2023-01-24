import styles from "./styles.module.scss";
import { Button } from "../Button";
import { useEffect, useRef, useState } from "react";
import { Preview } from "../Preview";

export const UploadButton = ({ onClick, onUplaod }) => {
  const ref = useRef(null);
  const [images, setImages] = useState([]);

  const handleClick = () => {
    ref.current.click();
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      console.log(file);
      const fileReader = new FileReader();
      fileReader.onload = (a) => {
        setImages((prev) => {
          return [
            ...prev,
            {
              name: file.name,
              size: file.size,
              url: fileReader.result,
            },
          ];
        });
      };

      fileReader.onprogress = (e) => {
        console.log("onprogress", e);
      };

      fileReader.readAsDataURL(file);
    });
  };

  const handleDelete = (id) => {
    console.log(id);
  };

  return (
    <div className={styles.uploader}>
      <div className={styles.wrapper}>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          multiple
          ref={ref}
          className={styles.input}
        />
        <Button onClick={handleClick}>Выбрать</Button>

        <Button onClick={handleClick} theme="primary">
          Загрузить
        </Button>
      </div>

      {images && (
        <div className={styles.imagesWrapper}>
          {images.map((preview) => {
            return (
              <Preview
                key={preview.size}
                title={preview.name}
                onDelete={handleDelete}
                url={preview.url}
                size={preview.size}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
