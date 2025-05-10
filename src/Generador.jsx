// src/Generador.jsx
import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import CanvasPreview from "./components/CanvasPreview";
import logo from "./assets/logobordarte1.png";
import { useEffect } from "react";
import { auth } from "./firebaseConfig";

const Generador = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    console.log("🧵 Usuario actual:", auth.currentUser);
  }, []);
  
  return (
    <main className="main-content">
      <div className="form-container">
        <img src={logo} className="logo" alt="Bordarte" />
        <ImageUploader setImageSrc={setImageSrc} setSettings={setSettings} />
      </div>
      {imageSrc && (
        <div className="preview-container">
          <CanvasPreview imageSrc={imageSrc} {...settings} />
        </div>
      )}
    </main>
  );
};

export default Generador;
