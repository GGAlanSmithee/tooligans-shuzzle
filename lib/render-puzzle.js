import { isNil } from "lodash"
import { tilesX, tilesY, width, height, tileWidth, tileHeight } from "./puzzle-constants"

const renderPuzzle = (clips, tiles, canvas, image) => {
  if (!clips.length || !tiles.length || !canvas || !image) return

  const ctx = canvas.getContext("2d")

  ctx.clearRect(0, 0, width, height)

  ctx.beginPath()
  ctx.rect(0, 0, width, height)
  ctx.fill()

  const w = width / tilesX
  const h = height / tilesY

  let draggedTileX = 0
  let draggedTileY = 0

  for (let y = 0; y < tilesY; ++y)
    for (let x = 0; x < tilesX; ++x) {
      const i = y * tilesY + x
      const tile = tiles[i]

      if (tile.offset.x !== 0 || tile.offset.y !== 0) {
        draggedTileX = x
        draggedTileY = y
        continue
      }

      const clip = clips[tile.clipIndex]

      if (!isNil(clip)) {
        ctx.drawImage(clip, x * w, y * h)
        ctx.beginPath()
        ctx.rect(x * w, y * h, w, h)
        ctx.stroke()
      }
    }

  const tileBeingDragged = tiles.find((t) => t.offset.x !== 0 || t.offset.y !== 0)

  if (tileBeingDragged) {
    const { clipIndex, offset: draggedOffset } = tileBeingDragged
    const clip = clips[clipIndex]

    const offsetX =
      draggedOffset.x >= tileWidth * 0.95
        ? tileWidth
        : draggedOffset.x <= -(tileWidth * 0.95)
        ? -tileWidth
        : draggedOffset.x
    const offsetY =
      draggedOffset.y >= tileHeight * 0.95
        ? tileHeight
        : draggedOffset.y <= -(tileHeight * 0.95)
        ? -tileHeight
        : draggedOffset.y

    if (!isNil(clip)) {
      ctx.drawImage(clip, draggedTileX * w + offsetX, draggedTileY * h + offsetY)
      ctx.beginPath()
      ctx.rect(draggedTileX * w + offsetX, draggedTileY * h + offsetY, w, h)
      ctx.stroke()
    }
  }
}

export { renderPuzzle }
