

import { type PayloadAction, type ThunkAction, type UnknownAction, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import type { PhotoInfoType } from "./photoReducer"
import { photoHistoryAPI, photoProcessAPI } from "../api/api"

type CurrentPhotoStateType = {
    photo: PhotoInfoType | null
    resultUrl: string | null
    enteredUrl: string | null
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>

const initialState: CurrentPhotoStateType = {
    photo: null,
    enteredUrl: null,
    resultUrl: null
}

const currentPhotoSlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        setCurrentPhoto: (state, photo: PayloadAction<PhotoInfoType>) => {
            state.photo = photo.payload
        }
    }
})

export const { setCurrentPhoto } = currentPhotoSlice.actions

export const getCurrentPhotoInfoThunk = (photoId: number): AppThunk => (dispatch) => {
    photoHistoryAPI.getPhotoInfo(photoId).then((reqRes) => {
        dispatch(setCurrentPhoto(reqRes.data))
    }).catch((error) => {
        if (error.response?.status === 401) {
            // 
        } else {
            console.log(error);
        }
    })
}

export const getCurrentPhotoUrlThunk = (photoId: number): AppThunk => (dispatch) => {
    photoProcessAPI.getEnteredPhoto(photoId).then((reqRes) => {
        // TODO:
    }).catch(() => {
        // TODO:
    })
    photoProcessAPI.getResultPhoto(photoId).then((reqRes) => {
        // TODO: 
    }).catch(() => {
        // TODO:
    })
}


export default currentPhotoSlice
