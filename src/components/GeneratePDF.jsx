import jsPDF from "jspdf";
import { agregarPortadaPDF } from "../pages/utils/generateCoverPage";
import "../fonts/pdfFonts"; 

export function generarPDF({ imageDataGlobal, palette, identifierMap, imageSrc, width, height }) {
  if (!imageDataGlobal) return;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  agregarPortadaPDF(doc, {
    width,
    height,
    colorCount: palette.length,
    imageSrc
  });

  let y = 20;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const cellSize = 20;
  const scaleFactor = 2;
  canvas.width = (width + 2) * cellSize * scaleFactor;
  canvas.height = (height + 2) * cellSize * scaleFactor;
  ctx.scale(scaleFactor, scaleFactor);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let xGrid = 0; xGrid < width; xGrid++) {
    ctx.fillStyle = "#666";
    ctx.fillText(xGrid + 1, (xGrid + 1.5) * cellSize, cellSize / 2);
  }

  for (let yGrid = 0; yGrid < height; yGrid++) {
    ctx.fillStyle = "#666";
    ctx.fillText(yGrid + 1, cellSize / 2, (yGrid + 1.5) * cellSize);
  }

  for (let yGrid = 0; yGrid < height; yGrid++) {
    for (let xGrid = 0; xGrid < width; xGrid++) {
      const idx = (yGrid * width + xGrid) * 4;
      const r = imageDataGlobal.data[idx];
      const g = imageDataGlobal.data[idx + 1];
      const b = imageDataGlobal.data[idx + 2];
      const closest = palette.reduce((prev, curr) => {
        const [cr, cg, cb] = curr.rgb;
        const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
        return dist < prev.dist ? { dist, color: curr } : prev;
      }, { dist: Infinity, color: null }).color;

      const colorKey = closest.rgb.join(",");
      const symbol = identifierMap[colorKey] || "";

      ctx.fillStyle = `rgb(${closest.rgb[0]},${closest.rgb[1]},${closest.rgb[2]})`;
      ctx.fillRect((xGrid + 1) * cellSize, (yGrid + 1) * cellSize, cellSize, cellSize);

      ctx.fillStyle = "black";
      ctx.fillText(symbol, (xGrid + 1.5) * cellSize, (yGrid + 1.5) * cellSize);

      ctx.strokeStyle = "#ccc";
      ctx.strokeRect((xGrid + 1) * cellSize, (yGrid + 1) * cellSize, cellSize, cellSize);
    }
  }

  // Cuadrantes (líneas gruesas cada 10)
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1.2;
  for (let i = 0; i <= width; i++) {
    if (i % 10 === 0) {
      ctx.beginPath();
      ctx.moveTo((i + 1) * cellSize, cellSize);
      ctx.lineTo((i + 1) * cellSize, (height + 1) * cellSize);
      ctx.stroke();
    }
  }
  for (let j = 0; j <= height; j++) {
    if (j % 10 === 0) {
      ctx.beginPath();
      ctx.moveTo(cellSize, (j + 1) * cellSize);
      ctx.lineTo((width + 1) * cellSize, (j + 1) * cellSize);
      ctx.stroke();
    }
  }
  ctx.lineWidth = 1;

  const patternImage = canvas.toDataURL("image/png");
  doc.setFont("Gloock");
  doc.setFontSize(12);
  doc.text("Vista del patrón pixelado", 15, y);
  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text("Cada cuadro representa un punto. Sigue el símbolo correspondiente para bordar con claridad.", 15, y);
  y += 5;
  doc.setTextColor(0);
  doc.addImage(patternImage, "PNG", 15, y, 180, 140);
  y += 150;

  // Tabla con estilo
  doc.setFontSize(12);
  doc.text("Tabla de hilos DMC utilizados", 15, y);
  y += 6;

  doc.setFillColor(230, 230, 250);
  doc.roundedRect(15, y, 180, 10, 2, 2, "F");
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.text("Color", 20, y + 7);
  doc.text("Código DMC", 40, y + 7);
  doc.text("Nombre", 80, y + 7);
  doc.text("Identificador", 150, y + 7);
  y += 12;

  palette.forEach((color, index) => {
    const id = identifierMap[color.rgb.join(",")];
    const [r, g, b] = color.rgb;

    if (y + 10 > 280) {
      doc.addPage();
      y = 20;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text("Color", 20, y);
      doc.text("Código DMC", 40, y);
      doc.text("Nombre", 80, y);
      doc.text("Identificador", 150, y);
      y += 6;
    }

    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 255);
      doc.rect(15, y - 5, 180, 8, "F");
    }

    doc.setFillColor(r, g, b);
    doc.rect(18, y - 3, 6, 6, "F");

    doc.setTextColor(0);
    doc.text(`${color.code}`, 42, y + 2);
    doc.text(color.name, 80, y + 2);
    doc.text(id, 155, y + 2);

    y += 8;
  });

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Generado con amor por BordArte", 15, 285);
  doc.text("www.bordarte.app", 195, 285, { align: "right" });

  const fecha = new Date().toISOString().split('T')[0];
  doc.save(`bordarte-patron-${fecha}.pdf`);
}
