import {atom} from 'recoil';

export const sectionsAtom = atom({
    key:'SectionAtom',
    default:[{
        sectionId:"",
        cardId:"",
        userId:""
    }]
})
