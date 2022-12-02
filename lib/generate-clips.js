import { height, imageHeight, imageWidth, last, tilesX, tilesY, width } from "./puzzle-constants";

const getClippedRegion = (image, x, y, w, h, iW, iH) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(image, x, y, iW, iH, 0, 0, w, h);

  return canvas;
};

const generateClips = (image) => {
  const clips = [];

  for (let y = 0; y < tilesY; ++y)
    for (let x = 0; x < tilesX; ++x) {
      const iW = 4000 / tilesX;
      const iH = 4000 / tilesY;
      const w = width / tilesX;
      const h = height / tilesY;

      const i = y * tilesY + x;
      const clip = i < last ? getClippedRegion(image, x * iW, y * iH, w, h, iW, iH) : null;

      clips.push(clip);
    }

  return clips;
};

export { generateClips };
