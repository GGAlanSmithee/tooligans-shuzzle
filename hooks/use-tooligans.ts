import { Lucid } from "lucid-cardano"

import { Responses } from "@blockfrost/blockfrost-js"

import { useTooligansAssets } from "./use-tooligans-assets"

export type Tooligan = Responses["asset"]

export const useTooligans = (lucid?: Lucid, networkId?: number): Tooligan[] => {
  return useTooligansAssets(lucid, networkId)
}
