import { photoAPI } from './../api/api';
import { type PayloadAction, type ThunkAction, type UnknownAction, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "./store"

type PhotoStateType = {
    currentPhoto: {
        photoId: number | null,
        taskId: string | null,
        status: string | null,
        progress: number,
        faces: number,
        plates: number,
        originalFilename: string | null,
        savedAs: string | null,
    },
    processingState: 'idle' | 'uploading' | 'processing' | 'success' | 'error',
    errorMessage: string | null,
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>

const initialState: PhotoStateType = {
    currentPhoto: {
        photoId: null,
        taskId: null,
        status: null,
        progress: 0,
        faces: 0,
        plates: 0,
        originalFilename: null,
        savedAs: null,
    },
    processingState: 'idle',
    errorMessage: null,
}

const photoSlice = createSlice({
    name: "photo",
    initialState,
    reducers: {
        setCurrentPhoto: (state, action: PayloadAction<{
            photoId: number,
            taskId: string,
            originalFilename?: string,
            savedAs?: string
        }>) => {
            state.currentPhoto.photoId = action.payload.photoId
            state.currentPhoto.taskId = action.payload.taskId
            state.currentPhoto.originalFilename = action.payload.originalFilename || null
            state.currentPhoto.savedAs = action.payload.savedAs || null
            state.processingState = 'uploading'
        },
        setProcessingState: (state, action: PayloadAction<'idle' | 'uploading' | 'processing' | 'success' | 'error'>) => {
            state.processingState = action.payload
        },
        setTaskProgress: (state, action: PayloadAction<{
            progress: number,
            faces: number,
            plates: number,
            status?: string
        }>) => {
            state.currentPhoto.progress = action.payload.progress
            state.currentPhoto.faces = action.payload.faces
            state.currentPhoto.plates = action.payload.plates
            if (action.payload.status) {
                state.currentPhoto.status = action.payload.status
            }
            state.processingState = 'processing'
        },
        setProcessingSuccess: (state, action: PayloadAction<{
            photoId: number,
            status: string,
            blurFaces: boolean,
            blurPlates: boolean,
            facesDetected: number,
            platesDetected: number
        }>) => {
            state.currentPhoto.photoId = action.payload.photoId
            state.currentPhoto.faces = action.payload.facesDetected
            state.currentPhoto.plates = action.payload.platesDetected
            state.processingState = 'success'
        },
        setProcessingError: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload
            state.processingState = 'error'
        },
        resetPhotoState: (state) => {
            state.currentPhoto = {
                photoId: null,
                taskId: null,
                status: null,
                progress: 0,
                faces: 0,
                plates: 0,
                originalFilename: null,
                savedAs: null,
            }
            state.processingState = 'idle'
            state.errorMessage = null
        },
    }
})

export const {
    setCurrentPhoto,
    setProcessingState,
    setTaskProgress,
    setProcessingSuccess,
    setProcessingError,
    resetPhotoState
} = photoSlice.actions

export const uploadPhotoThunk = (file: File): AppThunk => (dispatch) => {
    dispatch(setProcessingState('uploading'))
    
    photoAPI.uploadPhoto(file)
        .then((response) => {
            dispatch(setCurrentPhoto({
                photoId: response.data.photo_id,
                taskId: response.data.task_id,
                originalFilename: response.data.original_filename,
                savedAs: response.data.saved_as
            }))
            // Запускаем поллинг статуса задачи
            dispatch(pollTaskStatusThunk(response.data.task_id))
        })
        .catch((error) => {
            dispatch(setProcessingError(error.message || 'Ошибка загрузки фото'))
        })
}

export const pollTaskStatusThunk = (taskId: string): AppThunk => (dispatch) => {
    const pollInterval = setInterval(() => {
        photoAPI.getTaskStatus(taskId)
            .then((response) => {
                const data = response.data
                
                if (data.state === 'PENDING' || data.state === 'PROCESSING') {
                    dispatch(setTaskProgress({
                        progress: data.progress || 0,
                        faces: data.faces || 0,
                        plates: data.plates || 0,
                        status: data.status
                    }))
                } else if (data.state === 'SUCCESS') {
                    clearInterval(pollInterval)
                    dispatch(setProcessingSuccess({
                        photoId: data.result?.photo_id || 0,
                        status: data.result?.status || 'success',
                        blurFaces: data.result?.blur_faces || false,
                        blurPlates: data.result?.blur_plates || false,
                        facesDetected: data.result?.faces_detected || 0,
                        platesDetected: data.result?.plates_detected || 0
                    }))
                } else if (data.state === 'FAILURE') {
                    clearInterval(pollInterval)
                    dispatch(setProcessingError(data.error || 'Ошибка обработки'))
                }
            })
            .catch((error) => {
                clearInterval(pollInterval)
                dispatch(setProcessingError(error.message || 'Ошибка получения статуса'))
            })
    }, 1000) // Опрос каждую секунду
    
    // Сохраняем interval ID для возможной очистки
    return () => clearInterval(pollInterval)
}

export const stopPollingThunk = (): AppThunk => () => {
    // Можно реализовать через extraThunkArgument или refs
    // Для простоты просто меняем состояние
}

// Селекторы
export const selectCurrentPhoto = (state: RootState) => state.photo.currentPhoto
export const selectProcessingState = (state: RootState) => state.photo.processingState
export const selectErrorMessage = (state: RootState) => state.photo.errorMessage

export default photoSlice
