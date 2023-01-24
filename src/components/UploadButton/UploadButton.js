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

const firebaseConfig = {
  apiKey: "AIzaSyDc-d00SYx74gXx79vc8tSfDbVeTfI4AG8",
  authDomain: "upload-63e17.firebaseapp.com",
  projectId: "upload-63e17",
  storageBucket: "upload-63e17.appspot.com",
  messagingSenderId: "795292058029",
  appId: "1:795292058029:web:3b42d5e347e2e8bbdea124",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const UploadButton = () => {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [size, setSize] = useState();

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

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onload = (a) => {
        // setSize((prev) => {
        //   return { ...prev, total: files.length * 100 };
        // });
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
    const total = [];

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
                    loaded:
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                  };
                }

                if (
                  _image.id === image.id &&
                  snapshot.bytesTransferred === snapshot.totalBytes
                ) {
                  temp = { ...temp, ref: storageRef, done: true };
                }

                return temp || _image;
              });
            });
          },
          (error) => {
            console.error(error);
          }
          // () => {
          //   setImages((prev) => {
          //     return prev.map((_image) => ({ ..._image, loaded: undefined }));
          //   });
          // }
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

    const maxSize = filtered.length * 100;

    if (currentSize === maxSize) {
      setImages((prev) => {
        return prev.map((_image) => ({
          ..._image,
          done: undefined,
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
        <Button onClick={handleClick}>Выбрать</Button>

        <Button onClick={handleUpload} theme="primary">
          Загрузить
        </Button>
      </div>

      <ProgressBar percentage={getPercentage()} />

      {images && (
        <div className={styles.imagesWrapper}>
          {images.map((image) => {
            return (
              <Preview key={image.id} onDelete={handleDelete} image={image} />
            );
          })}
        </div>
      )}
    </div>
  );
};
