import styles from "./styles.module.scss";
import { Button } from "../Button";
import { useEffect, useRef, useState } from "react";
import { Preview } from "../Preview";
import { ProgressBar } from "../ProgressBar";
import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import env from "react-dotenv";

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.SENDER_ID,
  appId: env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const Upload = () => {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);

  const getUploadedImages = async () => {
    const listRef = ref(storage, "image/");

    const { items } = await listAll(listRef);

    let currentImages = [];

    for (const itemRef of items) {
      const url = await getDownloadURL(itemRef);
      const metaData = await getMetadata(itemRef);

      currentImages.push({
        name: metaData.name,
        size: metaData.size,
        url: url,
        ref: itemRef,
        id: metaData.customMetadata.id,
      });
    }

    setImages(currentImages);
  };

  useEffect(() => {
    getUploadedImages();
  }, []);

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImages((prev) => {
          return [
            ...prev,
            {
              name: file.name,
              size: file.size,
              url: fileReader.result,
              ref: null,
              file,
              id: uuidv4(),
            },
          ];
        });
      };

      fileReader.readAsDataURL(file);
    });
  };

  const handleDelete = async (image) => {
    if (image.ref) {
      await deleteObject(image.ref);
    }

    setImages((prev) => {
      return prev.filter((_image) => _image.id !== image.id);
    });
  };

  const handleUpload = () => {
    for (const image of images) {
      if (!image.ref) {
        image.loaded = 0;
        const storageRef = ref(storage, "image/" + image.name);

        const uploadTask = uploadBytesResumable(storageRef, image.file, {
          customMetadata: {
            id: image.id,
          },
        });

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setImages((prev) => {
              return prev.map((_image) => {
                let temp;
                if (_image.id === image.id) {
                  temp = {
                    ..._image,
                    loaded: snapshot.bytesTransferred,
                  };
                }

                if (
                  _image.id === image.id &&
                  snapshot.bytesTransferred === snapshot.totalBytes
                ) {
                  temp = { ...temp, ref: storageRef };
                }

                return temp || _image;
              });
            });
          },
          (error) => {
            console.error(error);
          }
        );
      }
    }
  };

  const getPercentage = () => {
    const filtered = images.filter((image) => image.loaded);

    if (!filtered.length) {
      return 0;
    }

    const currentSize = filtered.reduce((sum, image) => {
      return sum + image.loaded;
    }, 0);

    if (!currentSize) {
      return 0;
    }

    const maxSize = filtered.reduce((sum, image) => {
      return sum + image.size;
    }, 0);

    if (currentSize === maxSize) {
      setImages((prev) => {
        return prev.map((_image) => ({
          ..._image,
          loaded: undefined,
        }));
      });
      return 0;
    }

    return (currentSize * 100) / maxSize;
  };

  return (
    <div className={styles.uploader}>
      <div className={styles.wrapper}>
        <input
          type="file"
          accept="image/*"
          onChange={handleSelect}
          multiple
          ref={inputRef}
          className={styles.input}
        />
        <Button
          disabled={Boolean(getPercentage())}
          onClick={() => inputRef.current.click()}
        >
          Выбрать
        </Button>

        <Button
          disabled={Boolean(getPercentage())}
          onClick={handleUpload}
          theme="primary"
        >
          Загрузить
        </Button>
      </div>

      <ProgressBar percentage={getPercentage()} />

      {images.length > 0 ? (
        <div className={styles.imagesWrapper}>
          {images.map((image) => {
            return (
              <Preview key={image.id} onDelete={handleDelete} image={image} />
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>Нет данных</div>
      )}
    </div>
  );
};
