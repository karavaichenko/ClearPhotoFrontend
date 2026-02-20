import { type RootState } from "./store";


export const selectEmail = (state: RootState) => {
    return state.auth.me.email
}

export const selectResultCode = (state: RootState) => {
    return state.auth.me.resultCode
} 

export const selectUserState = (state: RootState) => {
    return state.auth.me
}