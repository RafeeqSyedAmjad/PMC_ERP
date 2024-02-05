import {atom} from 'recoil';

export const isAuthenticatedState = atom({
    key:'isAuthenticatedState',
    default:false,
})


export const tokenState = atom({
    key: 'tokenState',
    default: null,
})
