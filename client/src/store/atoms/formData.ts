import { atom } from "recoil";

interface IFormData {
  heading:String;
  title: string;
  link: string;
  share: boolean;
  type:string;
  tags: string[];
  button:string;
}
export const formdataAtom = atom<IFormData>({
    key:'FormData',
    default:{title:'',link:'',share:false,tags:[],type:'',heading:'Add Card',button:'Save Card'}
})