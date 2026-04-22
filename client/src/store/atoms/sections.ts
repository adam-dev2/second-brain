import {atom} from 'recoil';

export const sectionsAtom = atom({
    key:'SectionAtom',
    default:[{
        id:"",
        label:"",
        path:""
    }]
})
