import { useState, useEffect } from "react";

const ImageUploader = ({ setImageSrc, setSettings }) => {
  const [anchoCm, setAnchoCm] = useState(10);
  const [altoCm, setAltoCm] = useState(10);
  const [pixelSize, setPixelSize] = useState(8);
  const [countTela, setCountTela] = useState(14);
  const [colorCount, setColorCount] = useState(12);

  useEffect(() => {
    const puntosPorCm = countTela / 2.54;
    const targetWidth = Math.floor(anchoCm * puntosPorCm);
    const targetHeight = Math.floor(altoCm * puntosPorCm);

    setSettings({
      targetWidth,
      targetHeight,
      pixelSize,
      colorCount,
    });
  }, [anchoCm, altoCm, pixelSize, countTela, colorCount, setSettings]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-uploader">
      <label>
        Subir imagen:
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>

      <div className="input-row">
        <label>
          Ancho (cm):
          <input type="number" value={anchoCm} onChange={(e) => setAnchoCm(Number(e.target.value))} />
        </label>

        <label>
          Alto (cm):
          <input type="number" value={altoCm} onChange={(e) => setAltoCm(Number(e.target.value))} />
        </label>
      </div>

      <div className="input-row">
        <label>
          Tela (puntos/pulgada):
          <input type="number" value={countTela} onChange={(e) => setCountTela(Number(e.target.value))} />
        </label>

        <label>
          Tamaño visual del pixel (px):
          <input type="number" value={pixelSize} onChange={(e) => setPixelSize(Number(e.target.value))} />
        </label>
      </div>

      <div className="input-row">
        <label>
          Cantidad de colores:
          <input type="number" min="2" max="50" value={colorCount} onChange={(e) => setColorCount(Number(e.target.value))} />
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;