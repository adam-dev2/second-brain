import { atom } from "recoil";

export const cardsRefreshAtom = atom<number>({
  key: "cardsRefreshAtom",
  default: 0,
});
