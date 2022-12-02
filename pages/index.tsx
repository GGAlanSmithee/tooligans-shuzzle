import { Game } from "components/Game"
import { useCanvas } from "hooks/use-canvas"
import { useHasNamiExtension } from "hooks/use-lucid/use-has-nami-extension"
import { useLucid } from "hooks/use-lucid/use-lucid"
import { useTooligans } from "hooks/use-tooligans"
import { useRouter } from "next/router"
import { v4 as uuid } from "uuid"

import styles from "../styles/index.module.css"

const Index = () => {
  const { push } = useRouter()

  const hasNamiExtension = useHasNamiExtension()
  const { lucid, networkId } = useLucid()
  const tooligans = useTooligans(lucid, networkId)

  // strict equals to avoid undefined
  if (hasNamiExtension === false)
    return (
      <div className={styles.container}>
        <div className={styles.left} />
        <div>
          <h1 className={styles.namiTitle}>
            This game currently only works with the Nami extension installed.
          </h1>
        </div>
        <div className={styles.right} />
      </div>
    )

  // not initialized yet
  if (!lucid) return null

  return (
    <>
      <a href="https://github.com/GGAlanSmithee/tooligans-shuzzle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          decoding="async"
          loading="lazy"
          width="149"
          height="149"
          src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
          className={styles.forkMe}
          alt="Fork me on GitHub"
          data-recalc-dims="1"
        />
      </a>

      <div className={styles.container}>
        <aside className={styles.left}></aside>

        <div>
          <div className={styles.header}>
            <h1>Tooligans Shuzzle</h1>
            <h2>
              Choose your Tooligan to shuzzle with
            </h2>
            <small>
              If some of your tooligans aren&apos;t loading, it&apos;s a problem with the Blockfrost IPFS node, please refresh your page.
            </small>
          </div>

          <div className={styles.tooligansGrid}>
            {tooligans.map((tooligan, i) => {
              const img = tooligan.onchain_metadata?.image
                ?.toString()
                ?.replace("ipfs://", "https://ipfs.blockfrost.dev/ipfs/")

              return (
                <div
                  key={i}
                  className={styles.tooligan}
                  onClick={() => {
                    push(`/game?id=${uuid()}&img=${img}`)
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    width="400"
                    height="auto"
                    src={img}
                    alt={tooligan.asset_name || "Tooligan"}
                    className={styles.tooliganImage}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <aside className={styles.right}></aside>
      </div>
    </>
  )
}

export default Index
