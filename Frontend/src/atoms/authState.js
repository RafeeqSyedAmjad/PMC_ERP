import {atom} from 'recoil';

export const isAuthenticatedState = atom({
    key:'isAuthenticatedState',
    default:false,
})

// here initial value is false this shows user is still not authenticated