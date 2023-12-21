import "./App.css";
import { useEffect, useState } from "react";
import { storage } from "./firebase";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

function App() {
  const [uploadImage, setUploadImage] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imageListRef = ref(storage, "images/");

  const handleUpload = () => {
    if (uploadImage == null) return;
    const imageRef = ref(storage, `images/${uploadImage.name + v4()}`);
    uploadBytes(imageRef, uploadImage).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);
  console.log(imageUrls);

  return (
    <div className="App">
      <input
        type="file"
        onChange={(e) => {
          setUploadImage(e.target.files[0]);
        }}
      />
      <button onClick={handleUpload}>Upload</button>
      <div>
        {imageUrls.map((url) => {
          return (<><img className="img" src={url} /> <p>{url}</p></>);
        })}
      </div>
    </div>
  );
}

export default App;
