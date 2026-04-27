import {atom} from 'recoil';

export const secitonCardsAtom = atom({
    key:'SectionCards',
    default:[
        {
            id:"",
            title:"",
            link:"",
            tags:[],
            share:false,
            sectionId:"",
            createdAt:"",
            updatedAt:""
        }
    ]
})