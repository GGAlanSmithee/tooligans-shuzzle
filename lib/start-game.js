import { isNil, isEqual } from "lodash";
import { generateTiles } from "./generate-tiles";
import { paramIsDefined } from "./fetch-helper-functions";

const startGame = (id) => {
  try {
    if (!global.gameData) global.gameData = {}

    if (!paramIsDefined(id)) return null;

    const isNew = isNil(global.gameData[id]);

    if (isNew) global.gameData[id] = generateTiles();

    const isSolved = isEqual(global.gameData[id].originalTiles, global.gameData[id].tiles);

    return {
      tiles: global.gameData[id].tiles,
      isSolved,
      isNew,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { startGame };
