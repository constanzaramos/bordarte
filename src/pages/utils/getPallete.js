import quantize from "quantize";
import Color from "colorjs.io";

const hueBuckets = [
  { name: "red", min: 345, max: 15 },
  { name: "orange", min: 15, max: 45 },
  { name: "yellow", min: 45, max: 70 },
  { name: "green", min: 70, max: 170 },
  { name: "cyan", min: 170, max: 200 },
  { name: "blue", min: 200, max: 260 },
  { name: "purple", min: 260, max: 290 },
  { name: "magenta", min: 290, max: 320 },
  { name: "pink", min: 320, max: 345 },
];

const getHueBucket = (h) => {
  for (let bucket of hueBuckets) {
    if (
      (bucket.min > bucket.max && (h >= bucket.min || h < bucket.max)) ||
      (h >= bucket.min && h < bucket.max)
    ) {
      return bucket.name;
    }
  }
  return "other";
};

const rgbToHslHue = ([r, g, b]) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h;
  if (max === min) {
    h = 0;
  } else {
    const d = max - min;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return h;
};

const areLABColorsTooSimilar = (c1, c2, threshold = 12) => {
  const lab1 = new Color("srgb", c1.map(c => c / 255)).to("lab").coords;
  const lab2 = new Color("srgb", c2.map(c => c / 255)).to("lab").coords;
  const dist = Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
    Math.pow(lab1[1] - lab2[1], 2) +
    Math.pow(lab1[2] - lab2[2], 2)
  );
  return dist < threshold;
};

export const getPaletteFromImageData = (imageData, colorCount = 12, useSmartContrast = true) => {
  const pixels = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];

    if (a > 127 && r + g + b > 30) {
      pixels.push([r, g, b]);
    }
  }

  const cmap = quantize(pixels, 50);
  const rawPalette = cmap.palette();

  if (!useSmartContrast) {
    return rawPalette.slice(0, colorCount);
  }

  // Clasificar por tono (hue)
  const buckets = {};
  for (let color of rawPalette) {
    const hue = rgbToHslHue(color);
    const bucket = getHueBucket(hue);
    if (!buckets[bucket]) buckets[bucket] = [];
    buckets[bucket].push(color);
  }

  // Seleccionar 1 color representativo por grupo diverso
  const diverseColors = [];
  for (let bucket of Object.values(buckets)) {
    for (let color of bucket) {
      const isSimilar = diverseColors.some(c => areLABColorsTooSimilar(c, color));
      if (!isSimilar) {
        diverseColors.push(color);
        break; // uno por grupo
      }
    }
    if (diverseColors.length >= colorCount) break;
  }

  // Rellenar si faltan colores
  for (let color of rawPalette) {
    const isSimilar = diverseColors.some(c => areLABColorsTooSimilar(c, color));
    if (!isSimilar) {
      diverseColors.push(color);
    }
    if (diverseColors.length >= colorCount) break;
  }

  return diverseColors.slice(0, colorCount);
};
