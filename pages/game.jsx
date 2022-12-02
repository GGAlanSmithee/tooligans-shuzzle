import { isNil } from "lodash"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { startGame } from "lib/start-game"
import { parseJSON } from "lib/fetch-helper-functions"
import { Countdown } from "components/Countdown"
import { Puzzle } from "components/Puzzle"
import { tooliganDimensions } from "data/tooligan"

const HomePage = ({ id, img, isValid, tiles: tilesData, isSolved: wasSolved, isNew: wasNew }) => {
  const { push } = useRouter()
  const [isNew, setIsNew] = useState(wasNew)
  const [isSolved, setIsSolved] = useState(wasSolved)
  const [count, setCount] = useState(isNew ? 3 : -1)
  const [tiles, setTiles] = useState(tilesData)

  useEffect(() => {
    setTiles(tilesData)
  }, [tilesData])

  useEffect(() => {
    setIsNew(wasNew)
  }, [wasNew])

  useEffect(() => {
    setIsSolved(wasSolved)
  }, [tilesData, wasSolved])

  useEffect(() => {
    setCount(isNew ? 3 : -1)
  }, [tilesData, isNew])

  useEffect(() => {
    setCount(isSolved ? -1 : 3)
  }, [isSolved])

  useEffect(() => {
    setTiles(tilesData)
  }, [tilesData])

  const showCounter = useMemo(() => wasNew, [wasNew])
  const showPuzzle = useMemo(() => !showCounter || count < 0, [showCounter, count])

  const onMove = useCallback(
    (pos) => {
      fetch(`/api/move-tile?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pos }),
      })
        .then(parseJSON)
        .then((res) => {
          if (res.ok) {
            setIsSolved(res.json.isSolved)
            setTiles(res.json.tiles)
          }
        })
    },
    [id]
  )

  const puzzleProps = {
    img,
    isNew,
    tiles,
    setTiles,
    isSolved,
    onMove,
  }

  useEffect(() => {
    if (!isValid) push("/")
  }, [isValid, push])

  if (!isValid) return null

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {showCounter && <Countdown count={count} setCount={setCount} />}

      {showPuzzle && (
        <>
          <div
            style={{
              padding: "1rem",
              position: "absolute",
              right: "1rem",
              top: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              style={{}}
              alt="finished puzzle reference"
              src={img}
              width={tooliganDimensions.width}
              height={tooliganDimensions.height}
            />
          </div>

          <Puzzle {...puzzleProps} />
        </>
      )}
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const { id, img } = query

  const game = startGame(id)

  if (game === null)
    return {
      props: {
        id: null,
        img: null,
        isValid: false,
        tiles: [],
        isSolved: false,
        isNew: false,
      },
    }

  const { tiles, isSolved, isNew } = game

  return {
    props: {
      id,
      img,
      isValid: !isNil(id),
      tiles,
      isSolved,
      isNew,
    },
  }
}

export default HomePage
