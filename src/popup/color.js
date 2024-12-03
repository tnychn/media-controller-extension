const complementary = ([r, g, b]) => [255 - r, 255 - g, 255 - b];

const luminance = (rgb) => {
  const [a1, a2, a3] = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a1 * 0.2126 + a2 * 0.7152 + a3 * 0.0722;
};

const contrast = (rgb1, rgb2) => {
  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

const rgbToHex = (rgb) => "#" + rgb.map((value) => value.toString(16).padStart(2, "0")).join("");

export function getAccessibleColor(color) {
  const complement = complementary(color);
  const diffTo255 = 255 - Math.max(...complement);
  const complementBrighter = complement.map((c) => c + diffTo255);
  const contrastBrighter = contrast(color, complementBrighter);
  const diffTo0 = Math.min(...complement);
  const complementDarker = complement.map((c) => c - diffTo0);
  const contrastDarker = contrast(color, complementDarker);
  return rgbToHex(contrastBrighter > contrastDarker ? complementBrighter : complementDarker);
}
