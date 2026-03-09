import { type ThunkAction, type UnknownAction, type PayloadAction, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import { photoProcessAPI } from "../api/api"

export type StatusType = "init" | "successInfo" | "success" | "serverError" | "notFound"

type PhotoStateType = {
    status: StatusType
    photo: PhotoInfoType | null
    photoUrl: string | null
}

export type PhotoInfoType = {
    id: number
    input_path: string
    output_path: string
    faces: number
    plates: number
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>

const initialState: PhotoStateType = {
    status: "init",
    photo: null,
    photoUrl: null
}

const photoSlice = createSlice({
    name: "photo",
    initialState,
    reducers: {
        resetPhoto: (state) => {
            state.status = "init"
            state.photo = null
            state.photoUrl = null
        },
        setPhoto: (state, photo: PayloadAction<PhotoInfoType>) => {
            state.photo = photo.payload
        },
        setPhotoUrl: (state, photoUrl: PayloadAction<string>) => {
            state.photoUrl = photoUrl.payload
        },
        setStatus: (state, status: PayloadAction<StatusType>) => {
            state.status = status.payload
        }
    }
})

export const {resetPhoto, setPhoto, setPhotoUrl, setStatus} = photoSlice.actions

export const processPhotoThunk = (formData: FormData): AppThunk => (dispatch) => {
    photoProcessAPI.processPhoto(formData).then((reqRes) => {
        dispatch(setPhoto(reqRes.data))
        dispatch(setStatus("successInfo"))
    }).catch(error => {
        if (error.respose?.status === 500) {
            dispatch(setStatus("serverError")) 
        } else if (error.response?.status === 401) {
            // редирект на логин
        } else {
            console.log(error);
        }
    })
}

export const getResultPhotoThunk = (photoId: number): AppThunk => (dispatch) => {
    photoProcessAPI.getResultPhoto(photoId).then((reqRes) => {
        dispatch(setPhotoUrl(URL.createObjectURL(reqRes.data)))
        dispatch(setStatus("success"))
    }).catch((error) => {
        if (error.response?.status === 404) {
            dispatch(setStatus("notFound"))
        } else if (error.response?.status === 401) {
            // редирект на логин
        } else if (error.response?.status === 500) {
            dispatch(setStatus("serverError"))
        } else {
            console.log(error);
        }
    })
}

export default photoSlice
