const tilesX = 3;
const tilesY = 3;
const imageWidth = 632;
// TODO(Alan): Use difference resolutions for mobile and desktop.
const width = imageWidth // 500;
const aspectRatio = 1 // 0.79114;
const imageHeight = Math.floor(imageWidth * aspectRatio + 0.5);
const height = Math.floor(width * aspectRatio + 0.5);

const tileWidth = width / tilesX;
const tileHeight = height / tilesY;

const last = tilesY * tilesX - 1;

export { tilesX, tilesY, imageWidth, imageHeight, width, height, last, tileWidth, tileHeight };
