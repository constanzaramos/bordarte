import logobordarte1 from "../assets/logobordarte1.png";
import "../fonts/pdfFonts"

export function agregarPortadaPDF(doc, { width, height, colorCount, imageSrc }) {
  const margin = 20;
  let y = 30;

  doc.setFillColor(254, 250, 246); 
  doc.rect(0, 0, 210, 297, "F");

  // Marco decorativo (rectángulo interior)
  doc.setDrawColor(230, 200, 230); // lavanda suave para el borde
  doc.setLineWidth(0.5);
  doc.rect(15, 15, 180, 267);

  // Logo centrado arriba
  doc.addImage(logobordarte1, "PNG", 80, y, 50, 25);
  y += 35;

  // Título con tipografía cute y centrada
  doc.setFont("Gloock");
  doc.setFontSize(20);
  doc.setTextColor(85, 60, 100);
  doc.text("Patrón de bordado personalizado", 105, y, { align: "center" });
  y += 12;

  // Subtítulo más suave
  doc.setFont("Lato");
  doc.setFontSize(12);
  doc.setTextColor(100, 80, 100);
  doc.text("Diseño generado a partir de tu imagen.", 105, y, { align: "center" });
  y += 18;

  // Imagen centrada (sin usar onload para evitar que se pierda en jsPDF)
  if (imageSrc) {
    try {
      doc.addImage(imageSrc, "JPEG", 55, y, 100, 80);
    } catch (error) {
      console.warn("No se pudo cargar la imagen en portada:", error);
    }
  }

  y += 90;

  // Datos técnicos con separación clara
  const anchoCm = (width / 5.5).toFixed(1); // aproximado 14ct = 5.5 pt/cm
  const altoCm = (height / 5.5).toFixed(1);

  doc.setFont("Lato");
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text(`Tamaño del patrón: ${width} x ${height} puntos`, margin + 5, y);
  y += 8;
  doc.text(`Tamaño en cm: ${anchoCm} cm x ${altoCm} cm`, margin + 5, y);
  y += 8;
  doc.text(`Colores seleccionados: ${colorCount}`, margin + 5, y);
  y += 8;
  const fecha = new Date().toLocaleDateString("es-CL", { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Fecha de generación: ${fecha}`, margin + 5, y);

  // Pie de página
  doc.setFont("Lato");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("Hecho con amor en BordArte", margin, 285);
  doc.text("www.bordarte.app", 210 - margin, 285, { align: "right" });

  doc.addPage(); // Avanza a la siguiente página
}
