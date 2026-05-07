import { atom } from "recoil";

export interface SectionCard {
  id: string;
  title: string;
  link: string;
  tags: string[];
  share: boolean;
  sectionId: string;
  createdAt: string;
  updatedAt: string;
}

export const secitonCardsAtom = atom<SectionCard[]>({
  key: "SectionCards",
  default: [],
});