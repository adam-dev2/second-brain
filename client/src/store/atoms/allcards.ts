import { atom } from "recoil";
export interface Card {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  share: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
}
export const allcardsAtom = atom<Card[]>({
  key: "allcardsAtom",
  default: [],
});
