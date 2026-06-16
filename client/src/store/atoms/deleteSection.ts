import {atom} from 'recoil'

export const deleteSectionAtom = atom({
    key:'DeleteSection',
    default:{
        deletion:false,
        sectionId:""
    }
})