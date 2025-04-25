import quantize from "quantize";
import Color from "colorjs.io";

export const getPaletteFromImageData = (imageData, colorCount = 12) => {
  const pixels = [];

  // 1. Extraer todos los píxeles RGB
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    // Evitar colores muy oscuros (sombras o bordes)
    if (r + g + b > 30) {
      pixels.push([r, g, b]);
    }
  }

  // 2. Obtener paleta extendida con más colores de los necesarios
  const rawPalette = quantize(pixels, 30).palette(); // pedir 30 colores

  // 3. Convertir a LAB y eliminar colores similares
  const filtered = [];
  const threshold = 12; // diferencia mínima entre colores

  for (const rgb of rawPalette) {
    const lab = new Color("srgb", rgb.map((c) => c / 255)).to("lab").coords;

    const isTooSimilar = filtered.some((existing) => {
      const existingLab = new Color("srgb", existing.map((c) => c / 255)).to("lab").coords;
      const dist = Math.sqrt(
        Math.pow(lab[0] - existingLab[0], 2) +
        Math.pow(lab[1] - existingLab[1], 2) +
        Math.pow(lab[2] - existingLab[2], 2)
      );
      return dist < threshold;
    });

    if (!isTooSimilar) {
      filtered.push(rgb);
    }

    if (filtered.length >= colorCount) break;
  }

  return filtered.slice(0, colorCount);
};
