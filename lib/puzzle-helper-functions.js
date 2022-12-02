import { isNil, floor } from "lodash";
import { height, tilesX, tilesY, width } from "./puzzle-constants";

function getCursorPosition(canvas, e) {
  const rect = canvas.getBoundingClientRect();

  const clientX = e.clientX
    ? e.clientX
    : e.touches?.length
    ? e.touches[0]?.clientX
    : e.originalEvent?.length
    ? e.originalEvent.touches[0]?.clientX
    : e.changedTouches?.length
    ? e.changedTouches.item(0)?.clientX
    : null || null;

  const clientY = e.clientY
    ? e.clientY
    : e.touches?.length
    ? e.touches[0]?.clientY
    : e.originalEvent?.length
    ? e.originalEvent.touches[0]?.clientX
    : e.changedTouches?.length
    ? e.changedTouches.item(0)?.clientY
    : null || null;

  if (!clientX || !clientY) return null;

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  return { x, y };
}

const getTileIndex = (pos) => pos.y * tilesY + pos.x;

const posToTile = (pos) => {
  const tileWidth = width / tilesX;
  const tileHeight = height / tilesY;

  const x = floor(pos.x / tileWidth);
  const y = floor(pos.y / tileHeight);

  return { x, y };
};

const getNeighboringTile = (tiles, { x, y }, direction) => {
  const pos =
    direction === "top"
      ? y <= 0
        ? null
        : { x, y: y - 1 }
      : direction === "right"
      ? x >= tilesX - 1
        ? null
        : { x: x + 1, y }
      : direction === "bottom"
      ? y >= tilesX - 1
        ? null
        : { x, y: y + 1 }
      : direction === "left"
      ? x <= 0
        ? null
        : { x: x - 1, y }
      : null;

  if (isNil(pos)) return undefined;

  const index = getTileIndex(pos);

  return {
    ...tiles[index],
    ...pos,
    index,
  };
};

const swapArrayLocs = (arr, index1, index2) => {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
};

const moveTile = (tiles, pos) => {
  const neighboringTiles = [
    getNeighboringTile(tiles, pos, "top"),
    getNeighboringTile(tiles, pos, "right"),
    getNeighboringTile(tiles, pos, "bottom"),
    getNeighboringTile(tiles, pos, "left"),
  ];

  const to = neighboringTiles.find((t) => t !== undefined && !t.filled);

  if (to) {
    const fromIndex = pos.y * tilesY + pos.x;
    const newTiles = [...tiles];
    swapArrayLocs(newTiles, fromIndex, to.index);
    return newTiles;
  }

  return tiles;
};

export { posToTile, getCursorPosition, moveTile, getTileIndex, getNeighboringTile };
