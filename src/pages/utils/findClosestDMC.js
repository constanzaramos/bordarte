import dmcColors from "../../data/dmcColors";

export const findClosestDMC = (r, g, b) => {
  let minDist = Infinity;
  let closestColor = dmcColors[0];

  dmcColors.forEach((color) => {
    const [cr, cg, cb] = color.rgb;
    const dist =
      Math.pow(r - cr, 2) +
      Math.pow(g - cg, 2) +
      Math.pow(b - cb, 2);

    if (dist < minDist) {
      minDist = dist;
      closestColor = color;
    }
  });

  return closestColor;
};
