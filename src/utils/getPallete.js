import quantize from 'quantize';

export const getPaletteFromImageData = (imageData, colorCount = 12) => {
  const pixels = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    pixels.push([r, g, b]);
  }

  const colorMap = quantize(pixels, colorCount);
  return colorMap ? colorMap.palette() : [];
};