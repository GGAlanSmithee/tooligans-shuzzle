import createGame, { Game } from "gameloop"
import { UseCanvas } from "hooks/use-canvas"
import { Tooligan } from "hooks/use-tooligans"
import { useCallback, useEffect } from "react"

let game: Game | null = null

interface Props {
  canvas: UseCanvas
  tooligans: Tooligan[]
}

const Game = ({ canvas }: Props) => {
  const update = useCallback((dt: number) => {}, [])

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {}, [])

  useEffect(() => {
    if (!game) {
      if (!canvas.ctx) return

      game = createGame({
        renderer: canvas.ctx,
      })

      game.on("update", function (dt) {
        update(dt)
      })

      game.on("draw", function (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        draw(ctx)
      })

      game.start()
    }

    return () => {
      if (game !== null) {
        game.pause()
        game = null
      }
    }
  }, [canvas.ctx, canvas.width, canvas.height, draw, update])

  return <>{canvas.el}</>
}

export { Game }
