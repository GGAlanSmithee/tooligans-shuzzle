import { useTooligans } from "hooks/use-tooligans"
import { useRouter } from "next/router"
import { CardanoWalletSelector, useCardano } from "use-cardano"
import { v4 as uuid } from "uuid"

import styles from "../styles/index.module.css"

const Index = () => {
  const { push } = useRouter()

  const { lucid, networkId } = useCardano()

  const tooligans = useTooligans(lucid, networkId)

  return (
    <>
      <div className={styles.connectContainer}>
        <CardanoWalletSelector />
      </div>

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
            <h2>Choose your Tooligan to shuzzle with</h2>
            <small>
              If some of your tooligans aren&apos;t loading, it&apos;s a problem with the Blockfrost
              IPFS node, please refresh your page.
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
