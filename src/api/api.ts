import axios from "axios";


const instance = axios.create({
    baseURL: "http://localhost:8000/",
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
})

export const authAPI = {
    loginApi: (login: string, password: string) => {
        return instance.post<LoginResponseType>("auth/login", {login, password})
    },
    registerApi: (login: string, email: string, password: string) => {
        return instance.post("auth/registration", {login, email, password})
    },
    logoutApi: () => {
        return instance.delete<ResultCodeResponseType>("auth/logout")
    },
    verifyEmailApi: (code: number, hashcode: string, email: string) => {
        return instance.post("auth/registration/verify", {code, hashcode: String(hashcode), email})
    },
    authWithCookies: () => {
        return instance.get<LoginResponseType>("auth")
    },
    changePassword: (oldPassword: string, newPassword: string) => {
        return instance.post<ResultCodeResponseType>("auth/changePass", {oldPassword, newPassword})
    }
}

type LoginResponseType = {
    email: string,
    login: string,
    verify: boolean,
    resultCode: number
}

type ResultCodeResponseType = {
    resultCode: number
}

// Photo API types
export type PhotoUploadResponseType = {
    photo_id: number,
    task_id: string,
    status: string,
    message: string,
    original_filename: string,
    saved_as: string
}

export type TaskStatusType = {
    task_id: string,
    state: string,
    status?: string,
    progress?: number,
    faces?: number,
    plates?: number,
    result?: {
        photo_id: number,
        status: string,
        blur_faces: boolean,
        blur_plates: boolean,
        faces_detected: number,
        plates_detected: number,
        output_path: string
    },
    error?: string,
    info?: string
}

export type PhotoType = {
    id: number,
    url: string,
    processed: boolean,
    timestamp?: string | null,
    user_id?: number
}

export type UserPhotosResponseType = {
    user_id: number,
    total: number,
    limit: number,
    offset: number,
    photos: PhotoType[]
}

export type PhotoInfoType = {
    id: number,
    url: string,
    user_id: number,
    processed: boolean,
    timestamp?: string | null
}

export type PhotoStatsType = {
    user_id: number,
    total: number,
    processed: number,
    unprocessed: number
}

export const photoAPI = {
    uploadPhoto: (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        return instance.post<PhotoUploadResponseType>("photo/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
    },
    getTaskStatus: (taskId: string) => {
        return instance.get<TaskStatusType>(`photo/task/${taskId}`)
    },
    getProcessedPhoto: (photoId: number) => {
        return instance.get(`photo/result/${photoId}`, { responseType: 'blob' })
    },
    getUserPhotos: (limit?: number, offset?: number, processed?: boolean) => {
        const params = new URLSearchParams()
        if (limit !== undefined) params.append('limit', String(limit))
        if (offset !== undefined) params.append('offset', String(offset))
        if (processed !== undefined) params.append('processed', String(processed))
        return instance.get<UserPhotosResponseType>(`photo/user?${params.toString()}`)
    },
    getPhotoInfo: (photoId: number) => {
        return instance.get<PhotoInfoType>(`photo/${photoId}`)
    },
    deletePhoto: (photoId: number) => {
        return instance.delete<{ message: string, photo_id: number }>(`photo/${photoId}`)
    },
    updatePhotoStatus: (photoId: number, isProcessed: boolean) => {
        return instance.put<{ message: string, photo_id: number, isProcessed: boolean }>(`photo/${photoId}/status`, { isProcessed })
    },
    getPhotosStats: () => {
        return instance.get<PhotoStatsType>("photo/stats/count")
    },
    getUnprocessedPhotos: (limit?: number) => {
        return instance.get<UserPhotosResponseType>(`photo/unprocessed?limit=${limit || 10}`)
    }
}
