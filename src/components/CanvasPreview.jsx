import { useRef, useEffect, useState } from "react";
import { getPaletteFromImageData } from "../utils/getPallete";
import { findClosestDMC } from "../utils/findClosestDMC";
import jsPDF from "jspdf";

const CanvasPreview = ({
  imageSrc,
  targetWidth = 50,
  targetHeight,
  pixelSize = 8,
  colorCount = 12,
}) => {
  const canvasRef = useRef(null);
  const [palette, setPalette] = useState([]);
  const [imageDataGlobal, setImageDataGlobal] = useState(null);
  const [identifierMap, setIdentifierMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const generateIdentifiers = () => {
    const ids = [];
    for (let i = 65; i <= 90; i++) {
      ids.push(String.fromCharCode(i)); // A–Z
    }
    for (let i = 1; i <= 99; i++) {
      ids.push(i.toString().padStart(2, "0")); // 01–99
    }
    return ids.slice(0, 64);
  };

  useEffect(() => {
    if (!imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = targetWidth;
      tempCanvas.height = targetHeight;
      tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const imageData = tempCtx.getImageData(0, 0, targetWidth, targetHeight);
      setImageDataGlobal(imageData);

      const newPalette = getPaletteFromImageData(imageData, colorCount);
      const dmcPalette = newPalette.map(([r, g, b]) => {
        const hilo = findClosestDMC(r, g, b);
        return { ...hilo, originalRGB: [r, g, b] };
      });

      setPalette(dmcPalette);
      setCurrentPage(1);

      // Identificadores A-Z, 01-99
      const ids = generateIdentifiers();
      const map = dmcPalette.reduce((acc, color, index) => {
        acc[color.rgb.join(",")] = ids[index % ids.length];
        return acc;
      }, {});
      setIdentifierMap(map);

      const getClosestColor = (r, g, b) => {
        let minDist = Infinity;
        let closestColor = [0, 0, 0];

        dmcPalette.forEach((color) => {
          const [cr, cg, cb] = color.rgb;
          const dist =
            Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2);
          if (dist < minDist) {
            minDist = dist;
            closestColor = [cr, cg, cb];
          }
        });

        return `rgb(${closestColor[0]},${closestColor[1]},${closestColor[2]})`;
      };

      for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x++) {
          const index = (y * targetWidth + x) * 4;
          const r = imageData.data[index];
          const g = imageData.data[index + 1];
          const b = imageData.data[index + 2];
          const color = getClosestColor(r, g, b);
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }

      canvas.style.width = `${targetWidth * pixelSize}px`;
      canvas.style.height = `${targetHeight * pixelSize}px`;
      canvas.style.imageRendering = "pixelated";
      canvas.style.border = "1px solid #ccc";
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "80vh";
      canvas.style.borderRadius = "8px";
      canvas.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
    };

    img.src = imageSrc;
  }, [imageSrc, targetWidth, targetHeight, pixelSize, colorCount]);

  const generarPDF = () => {
    if (!imageDataGlobal) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFontSize(12);
    doc.text("Patrón de BordArte", 20, 20);

    const cellSize = 10;
    const gridCanvas = document.createElement("canvas");
    gridCanvas.width = targetWidth * cellSize + 30;
    gridCanvas.height = targetHeight * cellSize + 30;
    const ctx = gridCanvas.getContext("2d");
    ctx.font = "8px Arial";

    const getClosestColor = (r, g, b) => {
      let minDist = Infinity;
      let closestColor = [0, 0, 0];

      palette.forEach((color) => {
        const [cr, cg, cb] = color.rgb;
        const dist =
          Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2);
        if (dist < minDist) {
          minDist = dist;
          closestColor = [cr, cg, cb];
        }
      });

      return closestColor;
    };

    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const i = (y * targetWidth + x) * 4;
        const r = imageDataGlobal.data[i];
        const g = imageDataGlobal.data[i + 1];
        const b = imageDataGlobal.data[i + 2];

        const [cr, cg, cb] = getClosestColor(r, g, b);
        const id = identifierMap[`${cr},${cg},${cb}`];

        ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
        ctx.fillRect(x * cellSize + 30, y * cellSize + 30, cellSize, cellSize);

        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(id, x * cellSize + 30 + cellSize / 2, y * cellSize + 30 + cellSize / 2);

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * cellSize + 30, y * cellSize + 30, cellSize, cellSize);
      }
    }

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    for (let x = 0; x <= targetWidth; x++) {
      if (x % 10 === 0) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize + 30, 30);
        ctx.lineTo(x * cellSize + 30, targetHeight * cellSize + 30);
        ctx.stroke();
      }
    }
    for (let y = 0; y <= targetHeight; y++) {
      if (y % 10 === 0) {
        ctx.beginPath();
        ctx.moveTo(30, y * cellSize + 30);
        ctx.lineTo(targetWidth * cellSize + 30, y * cellSize + 30);
        ctx.stroke();
      }
    }

    ctx.fillStyle = "black";
    for (let x = 0; x < targetWidth; x++) {
      ctx.fillText(x + 1, x * cellSize + 32, 25);
    }
    for (let y = 0; y < targetHeight; y++) {
      ctx.fillText(y + 1, 10, y * cellSize + 38);
    }

    const imgData = gridCanvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 10, 30, 190, 150);

    let y = 190;
    doc.setFontSize(12);
    doc.text("Hilos DMC:", 15, y);

    palette.forEach((color) => {
      y += 8;
      const id = identifierMap[color.rgb.join(",")];
      doc.setFillColor(color.rgb[0], color.rgb[1], color.rgb[2]);
      doc.rect(15, y - 5, 5, 5, "F");
      doc.text(`${color.code} - ${color.name}  (Identificador: ${id})`, 25, y);
    });

    doc.save("bordarte-patron.pdf");
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = palette.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(palette.length / itemsPerPage);

  return (
    <div className="canvas-legend-wrapper">
      <div className="canvas-left">
        <p><strong>Patrón pixelado:</strong></p>
        <canvas ref={canvasRef} />
        <button onClick={generarPDF} className="download-button">
          Descargar como PDF
        </button>
      </div>

      <div className="canvas-right">
        <p><strong>Tabla de hilos DMC</strong></p>
        {currentItems.length > 0 && (
          <div className="color-legend">
            <table>
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>RGB</th>
                  <th>Identificador</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((color, i) => {
                  const id = identifierMap[color.rgb.join(",")];
                  return (
                    <tr key={i}>
                      <td>
                        <div
                          className="color-swatch"
                          style={{ backgroundColor: `rgb(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})` }}
                        />
                      </td>
                      <td>{color.code}</td>
                      <td>{color.name}</td>
                      <td>rgb({color.rgb[0]}, {color.rgb[1]}, {color.rgb[2]})</td>
                      <td>{id}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasPreview;
