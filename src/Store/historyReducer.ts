import { type PayloadAction, type ThunkAction, type UnknownAction, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import type { PhotoInfoType } from "./photoReducer"
import { photoHistoryAPI, photoProcessAPI } from "../api/api"

type HistoryStateType = {
    page: number
    limit: number
    photos: Array<PhotoInfoType>
    photoUrls: Array<string>
    count: number
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>

const initialState: HistoryStateType = {
    page: 1,
    limit: 10,
    count: 0,
    photos: [],
    photoUrls: []
}

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        setHistory: (state, history: PayloadAction<Array<PhotoInfoType>>) => {
            state.photos = history.payload
        },
        setPhotosCount: (state, count: PayloadAction<number>) => {
            state.count = count.payload
        },
        setPhotoUrls: (state, urls: PayloadAction<Array<string>>) => {
            state.photoUrls = urls.payload
        },
        setHistoryPage: (state, page: PayloadAction<number>) => {
            state.page = page.payload
        },
        setHistoryLimit: (state, limit: PayloadAction<number>) => {
            state.limit = limit.payload
        }
    }
})

export const {setHistory, setPhotoUrls, setHistoryLimit, setHistoryPage, setPhotosCount} = historySlice.actions

export const getHistoryThunk = (page: number, limit: number): AppThunk => (dispatch) => {
    photoHistoryAPI.getPhotoHistory(page, limit).then((reqRes) => {
        dispatch(setHistory(reqRes.data.photos))
        dispatch(setPhotosCount(reqRes.data.count))
    }).catch(error => {
        if (error.response?.status === 401) {
            // 
        } else {
            console.log(error);
        }
    })
}

export const getHistoryPhotosThunk = (ids: Array<number>): AppThunk => async (dispatch) => {
    try {
        const photosPromises = ids.map(async (id) => {
            try {
                const response = await photoProcessAPI.getResultPhoto(id)
                if (response.status == 404) {
                    return ""
                }
                return URL.createObjectURL(response.data)
            } catch (error) {
                console.error(`Ошибка загрузки фото для сотрудника ${id}:`, error);
                return ''
            }
        });

        const photosUrls = await Promise.all(photosPromises);
        dispatch(setPhotoUrls(photosUrls));
    } catch (error) {
        console.error('Ошибка в getHistoryPhotosThunk: ', error);
    }
}

export default historySlice
