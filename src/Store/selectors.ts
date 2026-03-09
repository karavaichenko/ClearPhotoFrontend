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