

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
        setCurrentPhotoInfo: (state, photo: PayloadAction<PhotoInfoType>) => {
            state.photo = photo.payload
        },
        setCurrentPhotoResultUrl: (state, url: PayloadAction<string>) => {
            state.resultUrl = url.payload
        },
        setCurrentPhotoEnteredUrl: (state, url: PayloadAction<string>) => {
            state.enteredUrl = url.payload
        },
        resetCurrentPhotoState: (state) => {
            state.photo = null
            state.enteredUrl = null
            state.resultUrl = null
        }
    }
})

export const { setCurrentPhotoInfo, setCurrentPhotoResultUrl, setCurrentPhotoEnteredUrl, resetCurrentPhotoState } = currentPhotoSlice.actions

export const getCurrentPhotoInfoThunk = (photoId: number): AppThunk => (dispatch) => {
    photoHistoryAPI.getPhotoInfo(photoId).then((reqRes) => {
        dispatch(setCurrentPhotoInfo(reqRes.data))
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
        dispatch(setCurrentPhotoEnteredUrl(URL.createObjectURL(reqRes.data)))
    }).catch((error) => {
        if (error.response?.status === 401) {
            // 
        } else {
            console.log(error);
        }
    })
    photoProcessAPI.getResultPhoto(photoId).then((reqRes) => {
        dispatch(setCurrentPhotoResultUrl(URL.createObjectURL(reqRes.data)))
    }).catch((error) => {
        if (error.response?.status === 401) {
            // 
        } else {
            console.log(error);
        }
    })
}


export default currentPhotoSlice
