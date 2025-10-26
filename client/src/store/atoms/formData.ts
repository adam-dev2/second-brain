import { atom } from "recoil";

interface IFormData {
  title: string;
  link: string;
  share: boolean;
  tags: string[];
}
export const formdataAtom = atom<IFormData>({
    key:'FormData',
    default:{title:'',link:'',share:false,tags:[]}
})