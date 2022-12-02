import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useCallback, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import createGame from "gameloop"
import {
  getTileIndex,
  getCursorPosition,
  posToTile,
  getNeighboringTile,
} from "../lib/puzzle-helper-functions"
import { width, height, tileWidth, tileHeight } from "../lib/puzzle-constants"
import { generateClips } from "../lib/generate-clips"
import { renderPuzzle } from "../lib/render-puzzle"
import styles from "../styles/Home.module.css"
import { clamp, floor, isUndefined } from "lodash"

const useImage = (src) => {
  const [loaded, setLoaded] = useState(false)
  const image = useRef()

  useEffect(() => {
    var loadedImage = new Image()

    loadedImage.onload = function () {
      image.current = this
      setLoaded(true)
    }

    loadedImage.width = width
    loadedImage.height = height
    loadedImage.style.width = width
    loadedImage.style.height = height
    loadedImage.src = src
  }, [src])

  return { loaded, image }
}

let game

const Puzzle = ({ img, tiles, isSolved, onMove, isNew }) => {
  const { push } = useRouter()
  const canvas = useRef()
  const { loaded, image } = useImage(img)

  const [hasInteracted, setHasInteracted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [currentMousePos, setCurrentMousePos] = useState(isUndefined)
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 })
  const [clips, setClips] = useState([])

  useEffect(() => {
    if (!loaded || clips.length > 0) return

    if (image.current) setClips(generateClips(image.current))
  }, [clips, setClips, image, loaded])

  const onMouseMove = useCallback(
    (e) => {
      if (!isDragging) {
        setCurrentMousePos(undefined)
      } else {
        const pos = getCursorPosition(canvas.current, e)
        if (pos) setCurrentMousePos(pos)
      }
    },
    [canvas, isDragging]
  )

  const onMouseDown = useCallback(
    (e) => {
      if (isSolved) return

      setHasInteracted(true)
      setIsDragging(true)
      const pos = getCursorPosition(canvas.current, e)

      if (!pos) return

      setMouseDownPos(pos)
      getTileIndex(posToTile(pos))
    },
    [canvas, isSolved]
  )

  const onMouseUp = useCallback(
    (e) => {
      if (isSolved) return

      // NOTE(Alan): This timeout prevents the tile from visually flickering back to it's original position
      setTimeout(() => {
        setIsDragging(false)
      }, 50)

      if (isSolved || tiles.length === 0) return

      const pos = getCursorPosition(canvas.current, e)

      if (!pos) return

      const downPos = posToTile(mouseDownPos)

      const [topTile, rightTile, bottomTile, leftTile] = [
        getNeighboringTile(tiles, downPos, "top"),
        getNeighboringTile(tiles, downPos, "right"),
        getNeighboringTile(tiles, downPos, "bottom"),
        getNeighboringTile(tiles, downPos, "left"),
      ]

      // NOTE(Alan): make sure the tile is dragged at least 75% of a tiles size
      const hasMovedXLeft =
        leftTile?.filled === false && pos.x - mouseDownPos.x < -(tileWidth * 0.75)
      const hasMovedXRight =
        rightTile?.filled === false && pos.x - mouseDownPos.x > tileWidth * 0.75
      const hasMovedYUp = topTile?.filled === false && pos.y - mouseDownPos.y < -(tileHeight * 0.75)
      const hasMovedYDown =
        bottomTile?.filled === false && pos.y - mouseDownPos.y > tileHeight * 0.75

      if (!hasMovedXLeft && !hasMovedXRight && !hasMovedYUp && !hasMovedYDown) return

      const tilePos = posToTile(mouseDownPos)
      onMove(tilePos)
    },
    [isSolved, tiles, onMove, mouseDownPos]
  )

  useEffect(() => {
    if (isSolved || !canvas.current) return

    if (!game) {
      const renderer = canvas.current.getContext("2d")

      game = createGame({
        renderer,
      })

      let x = (width / 3) * 2 + width / 3 / 2
      let y = (height / 3) * 1 + height / 3 / 2

      let pausedTime = 0
      let pause = false

      if (game)
        game.on("update", function (dt) {
          if (!hasInteracted && pause) {
            pausedTime += dt

            if (pausedTime >= 0.4) {
              pause = false
              pausedTime = 0
            }
          } else {
            y += dt * 180

            if (y > (height / 3) * 2 + height / 3 / 2) {
              pause = true
              y = (height / 3) * 1 + height / 3 / 2
            }
          }
        })

      if (game)
        game.on("draw", function (context) {
          const mouseOffsetX = clamp(
            currentMousePos ? currentMousePos.x - mouseDownPos.x : 0,
            floor(mouseDownPos.x / tileWidth) - 1 * tileWidth,
            floor(mouseDownPos.x / tileWidth) + 1 * tileWidth
          )

          const mouseOffsetY = clamp(
            currentMousePos ? currentMousePos.y - mouseDownPos.y : 0,
            floor(mouseDownPos.y / tileHeight) - 1 * tileHeight,
            floor(mouseDownPos.y / tileHeight) + 1 * tileHeight
          )

          const offset = {
            x: mouseOffsetX,
            y: mouseOffsetY,
          }

          const pos = posToTile(mouseDownPos)
          const tileBeingDraggedIndex = getTileIndex(posToTile(mouseDownPos))

          const [topTile, rightTile, bottomTile, leftTile] = [
            getNeighboringTile(tiles, pos, "top"),
            getNeighboringTile(tiles, pos, "right"),
            getNeighboringTile(tiles, pos, "bottom"),
            getNeighboringTile(tiles, pos, "left"),
          ]

          const tilesToRender = tiles.map((tile, i) => {
            if (tileBeingDraggedIndex !== i) return { ...tile, offset: { x: 0, y: 0 } }

            if (
              (offset.x < 0 && leftTile?.filled === false) ||
              (offset.x > 0 && rightTile?.filled === false)
            )
              return {
                ...tile,
                offset: {
                  x: mouseOffsetX,
                  y: 0,
                },
              }

            if (
              (offset.y < 0 && topTile?.filled === false) ||
              (offset.y > 0 && bottomTile?.filled === false)
            )
              return {
                ...tile,
                offset: {
                  x: 0,
                  y: mouseOffsetY,
                },
              }

            return { ...tile, offset: { x: 0, y: 0 } }
          })

          renderPuzzle(clips, tilesToRender, canvas.current, image.current)

          if (isNew && !hasInteracted && !pause) {
            context.lineWidth = 2
            context.strokeStyle = "rgba(255, 255, 255, 1)"
            context.beginPath()
            context.arc(x + 1, y + 1, 45, 0, 2 * Math.PI)
            context.stroke()
            context.strokeStyle = "rgba(0, 0, 0, 1)"
            context.lineWidth = 1
          }
        })

      game.start()
    }

    return () => {
      game.pause()
      game = null
    }
  }, [canvas, tiles, image, clips, currentMousePos, mouseDownPos, hasInteracted, isNew, isSolved])

  return (
    <div className={styles.container}>
      <Head>
        <title>Tooligans Shuffle</title>
        <meta name="description" content="A fun game of puzzle shuffle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div
          style={{
            position: "absolute",
            fontSize: "5rem",
          }}
        >
          {isSolved && (
            <div
              style={{
                fontFamily: "sans-serif",
                color: "white",
                textShadow: "0 0 10px black",
              }}
            >
              SOLVED!
            </div>
          )}
        </div>

        <canvas
          onTouchMove={onMouseMove}
          onMouseMove={onMouseMove}
          onTouchStart={onMouseDown}
          onMouseDown={onMouseDown}
          onTouchEnd={onMouseUp}
          onMouseUp={onMouseUp}
          onTouchCancel={onMouseUp}
          onMouseLeave={onMouseUp}
          ref={canvas}
          width={width}
          height={height}
        />

        <div style={{ height: 0 }}>
          {isSolved && (
            <div
              style={{
                fontSize: "2rem",
                marginTop: "1rem",
                fontFamily: "sans-serif",
                textDecoration: "underline",
                textUnderlineOffset: "0.5rem",
                color: "white",
              }}
            >
              <Link href="/">
                <span
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    const id = uuid()

                    push(`/`)
                  }}
                  style={{
                    paddingTop: "1rem",
                    textAlign: "center",
                    width: "100%",
                    cursor: "pointer",
                    color: "#2980B9",
                    margin: "0 1rem",
                  }}
                >
                  shuzzle another tooligan
                </span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export { Puzzle }
