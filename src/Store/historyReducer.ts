import { photoAPI } from './../api/api';
import { type PayloadAction, type ThunkAction, type UnknownAction, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "./store"

type PhotoHistoryType = {
    id: number,
    url: string,
    processed: boolean,
    timestamp?: string | null,
    user_id?: number
}

type HistoryStateType = {
    photos: PhotoHistoryType[],
    total: number,
    limit: number,
    offset: number,
    isLoading: boolean,
    stats: {
        total: number,
        processed: number,
        unprocessed: number
    },
    filter: 'all' | 'processed' | 'unprocessed',
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>

const initialState: HistoryStateType = {
    photos: [],
    total: 0,
    limit: 50,
    offset: 0,
    isLoading: false,
    stats: {
        total: 0,
        processed: 0,
        unprocessed: 0
    },
    filter: 'all',
}

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        setPhotos: (state, action: PayloadAction<{ photos: PhotoHistoryType[], total: number }>) => {
            state.photos = action.payload.photos
            state.total = action.payload.total
        },
        appendPhotos: (state, action: PayloadAction<PhotoHistoryType[]>) => {
            state.photos = [...state.photos, ...action.payload]
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setStats: (state, action: PayloadAction<{ total: number, processed: number, unprocessed: number }>) => {
            state.stats = action.payload
        },
        setFilter: (state, action: PayloadAction<'all' | 'processed' | 'unprocessed'>) => {
            state.filter = action.payload
            state.offset = 0
            state.photos = []
        },
        setPagination: (state, action: PayloadAction<{ limit: number, offset: number }>) => {
            state.limit = action.payload.limit
            state.offset = action.payload.offset
        },
        removePhoto: (state, action: PayloadAction<number>) => {
            state.photos = state.photos.filter(photo => photo.id !== action.payload)
            state.total = state.total - 1
        },
        updatePhotoProcessed: (state, action: PayloadAction<{ id: number, processed: boolean }>) => {
            const photo = state.photos.find(p => p.id === action.payload.id)
            if (photo) {
                photo.processed = action.payload.processed
            }
        },
    }
})

export const {
    setPhotos,
    appendPhotos,
    setLoading,
    setStats,
    setFilter,
    setPagination,
    removePhoto,
    updatePhotoProcessed
} = historySlice.actions

export const fetchUserPhotosThunk = (
    limit?: number,
    offset?: number,
    filter?: 'all' | 'processed' | 'unprocessed'
): AppThunk => (dispatch, getState) => {
    dispatch(setLoading(true))
    
    const state = getState().history
    const currentLimit = limit !== undefined ? limit : state.limit
    const currentOffset = offset !== undefined ? offset : state.offset
    const currentFilter = filter !== undefined ? filter : state.filter
    
    let processedFilter: boolean | undefined = undefined
    if (currentFilter === 'processed') processedFilter = true
    if (currentFilter === 'unprocessed') processedFilter = false
    
    photoAPI.getUserPhotos(currentLimit, currentOffset, processedFilter)
        .then((response) => {
            if (currentOffset === 0) {
                dispatch(setPhotos({
                    photos: response.data.photos,
                    total: response.data.total
                }))
            } else {
                dispatch(appendPhotos(response.data.photos))
            }
            dispatch(setPagination({ limit: currentLimit, offset: currentOffset }))
            dispatch(setLoading(false))
            // Загружаем статистику
            dispatch(fetchPhotosStatsThunk())
        })
        .catch((error) => {
            console.error('Ошибка загрузки фото:', error)
            dispatch(setLoading(false))
        })
}

export const fetchPhotosStatsThunk = (): AppThunk => (dispatch) => {
    photoAPI.getPhotosStats()
        .then((response) => {
            dispatch(setStats({
                total: response.data.total,
                processed: response.data.processed,
                unprocessed: response.data.unprocessed
            }))
        })
        .catch((error) => {
            console.error('Ошибка загрузки статистики:', error)
        })
}

export const deletePhotoThunk = (photoId: number): AppThunk => (dispatch) => {
    photoAPI.deletePhoto(photoId)
        .then(() => {
            dispatch(removePhoto(photoId))
            dispatch(fetchPhotosStatsThunk())
        })
        .catch((error) => {
            console.error('Ошибка удаления фото:', error)
        })
}

export const updatePhotoStatusThunk = (photoId: number, isProcessed: boolean): AppThunk => (dispatch) => {
    photoAPI.updatePhotoStatus(photoId, isProcessed)
        .then(() => {
            dispatch(updatePhotoProcessed({ id: photoId, processed: isProcessed }))
            dispatch(fetchPhotosStatsThunk())
        })
        .catch((error) => {
            console.error('Ошибка обновления статуса:', error)
        })
}

export const changeFilterThunk = (filter: 'all' | 'processed' | 'unprocessed'): AppThunk => (dispatch) => {
    dispatch(setFilter(filter))
    dispatch(fetchUserPhotosThunk(50, 0, filter))
}

export const loadMorePhotosThunk = (): AppThunk => (dispatch, getState) => {
    const state = getState().history
    const newOffset = state.offset + state.limit

    if (newOffset < state.total) {
        dispatch(fetchUserPhotosThunk(state.limit, newOffset))
    }
}

// Селекторы
export const selectHistoryPhotos = (state: RootState) => state.history.photos
export const selectHistoryTotal = (state: RootState) => state.history.total
export const selectHistoryLimit = (state: RootState) => state.history.limit
export const selectHistoryOffset = (state: RootState) => state.history.offset
export const selectHistoryLoading = (state: RootState) => state.history.isLoading
export const selectHistoryStats = (state: RootState) => state.history.stats
export const selectHistoryFilter = (state: RootState) => state.history.filter

export default historySlice
