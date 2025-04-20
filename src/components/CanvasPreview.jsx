import { useRef, useEffect, useState } from "react";
import { getPaletteFromImageData } from "../utils/getPallete";
import { findClosestDMC } from "../utils/findClosestDMC";

const CanvasPreview = ({
    imageSrc,
    targetWidth = 50,
    targetHeight,
    pixelSize = 8,
    mostrarGrilla = true,
    colorCount = 12,
  }) => {
    const canvasRef = useRef(null);
    const [palette, setPalette] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
  
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
  
        const newPalette = getPaletteFromImageData(imageData, colorCount);
        const dmcPalette = newPalette.map(([r, g, b]) => {
          const hilo = findClosestDMC(r, g, b);
          return { ...hilo, originalRGB: [r, g, b] };
        });
  
        setPalette(dmcPalette);
        setCurrentPage(1);
  
        const getClosestColor = (r, g, b) => {
          let minDist = Infinity;
          let closestColor = [0, 0, 0];
  
          dmcPalette.forEach((color) => {
            const [cr, cg, cb] = color.rgb;
            const dist = Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2);
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
  
        if (mostrarGrilla) {
          for (let x = 0; x <= targetWidth; x++) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, targetHeight);
            ctx.strokeStyle = x % 10 === 0 ? "#ff0000" : "#ffaaaa";
            ctx.lineWidth = x % 10 === 0 ? 0.5 : 0.3;
            ctx.stroke();
          }
          for (let y = 0; y <= targetHeight; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(targetWidth, y);
            ctx.strokeStyle = y % 10 === 0 ? "#ff0000" : "#ffaaaa";
            ctx.lineWidth = y % 10 === 0 ? 0.5 : 0.3;
            ctx.stroke();
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
    }, [imageSrc, targetWidth, targetHeight, pixelSize, mostrarGrilla, colorCount]);
  
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentItems = palette.slice(startIdx, startIdx + itemsPerPage);
    const totalPages = Math.ceil(palette.length / itemsPerPage);
  
    const handleDownloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
      
        const link = document.createElement("a");
        link.download = "bordarte-patron.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      
    return (
      <div className="canvas-legend-wrapper">
        <div className="canvas-left">
          <p><strong>Patrón pixelado:</strong></p>
          <canvas ref={canvasRef} />
          <button onClick={handleDownloadImage} className="download-button">
  Descargar patrón como imagen
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
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((color, i) => (
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
                    </tr>
                  ))}
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
  