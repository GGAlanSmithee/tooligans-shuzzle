// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { isEqual, isNil } from "lodash";
import { moveTile } from "lib/puzzle-helper-functions";
import { paramIsDefined } from "lib/fetch-helper-functions";

export default function handler(req, res) {
  const { id } = req.query;
  const { pos } = req.body;

  if (!global.gameData) global.gameData = {};

  try {
    if (!paramIsDefined(id)) return res.status(400).json({ message: "invalid id" });
    if (!paramIsDefined(global.gameData[id])) return res.status(400).json({ message: "invalid id" });
    if (!paramIsDefined(pos)) return res.status(400).json({ message: "invalid pos" });
    if (isNil(pos.x) || isNil(pos.y)) return res.status(400).json({ message: "invalid pos" });

    const { tiles } = global.gameData[id];

    global.gameData[id].tiles = moveTile(tiles, pos);

    const isSolved = isEqual(global.gameData[id].originalTiles, global.gameData[id].tiles);

    res.status(200).json({
      tiles: global.gameData[id].tiles,
      isSolved,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "invalid id" });
  }
}
