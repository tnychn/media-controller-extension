// eslint-disable-next-line no-unused-vars
const Utils = {
  invertColorHex: ([r, g, b]) => "#" + (0xffffff ^ ((1 << 24) | (r << 16) | (g << 8) | b)).toString(16).slice(1),
};
