export function registerDejaVu(doc) {
    const font = "BASE64_AQUÍ"; // reemplazado abajo
  
    doc.addFileToVFS("DejaVuSans.ttf", font);
    doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
  }
  