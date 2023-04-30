// eslint-disable-next-line no-unused-vars
const Utils = {
  extractImageColor: async (src) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    return new Promise((resolve) => {
      let image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, 1, 1);
        resolve(context.getImageData(0, 0, 1, 1).data); // rgba
      };
      image.src = src;
    });
  },
};
