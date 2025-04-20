import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import CanvasPreview from "./components/CanvasPreview";
import logo from "./assets/logo-bordarte.png";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [settings, setSettings] = useState({}); // opcional para más parámetros

  return (
    <main className="main-content">
      <div className="form-container">
        <img src={logo} className="logo" alt="Bordarte" className="logo" />
        <ImageUploader setImageSrc={setImageSrc} setSettings={setSettings} />
      </div>

      {imageSrc && (
        <div className="preview-container">
          <CanvasPreview
            imageSrc={imageSrc}
            {...settings}
          />
        </div>
      )}
    </main>
  );
}

export default App;
