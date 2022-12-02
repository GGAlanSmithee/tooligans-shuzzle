import { random } from "lodash";
import { last, tilesX, tilesY } from "./puzzle-constants";
import { moveTile } from "./puzzle-helper-functions";

const shuffle = (originalTiles) => {
  let tiles = [...originalTiles];

  let i = 0;
  while (true) {
    const pos = {
      x: random(0, tilesX - 1),
      y: random(0, tilesY - 1),
    };

    tiles = moveTile(tiles, pos);

    i++;
    
    if (tiles[8].filled === false && i > 1000) break;
  }

  return tiles;
};

const generateTiles = () => {
  const originalTiles = Array.from({ length: tilesX * tilesY }, (_, i) => ({
    clipIndex: i,
    filled: i !== last,
  }));

  const tiles = shuffle(originalTiles);

  return {
    originalTiles,
    tiles,
  };
};

export { generateTiles };
