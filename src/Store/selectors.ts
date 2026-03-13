import { type RootState } from "./store";


// =============== AUTH SELECTORS ==================

export const selectEmail = (state: RootState) => {
    return state.auth.me.email
}

export const selectResultCode = (state: RootState) => {
    return state.auth.me.resultCode
} 

export const selectUserState = (state: RootState) => {
    return state.auth.me
}

// =============== ACCOUNT SELECTORS ==================

export const selectAccountInfo = (state: RootState) => {
    return state.account
}

export const selectChangePasswordStatus = (state: RootState) => {
    return state.account.changePassStatus
}

// =============== PHOTO SELECTORS ==================

export const selectProcessStatus = (state: RootState) => {
    return state.photo.status
} 

export const selectPhotoInfo = (state: RootState) => {
    return state.photo.photo
}

export const selectPhotoUrl = (state: RootState) => {
    return state.photo.photoUrl
}

// =============== HISTORY SELECTORS ==================

export const selectHistoryState = (state: RootState) => {
    return state.history
}

export const selectHistory = (state: RootState) => {
    return state.history.photos
}

export const selectHistoryPhotoUrls = (state: RootState) => {
    return state.history.photoUrls
}

// =============== CURRENT PHOTO SELECTORS ==================


export const selectCurrentPhotoInfo = (state: RootState) => {
    return state.currentPhoto.photo
}

export const selectCurrentResultUrl = (state: RootState) => {
    return state.currentPhoto.resultUrl
}

export const selectCurrentEnteredUrl = (state: RootState) => {
    return state.currentPhoto.enteredUrl
}

