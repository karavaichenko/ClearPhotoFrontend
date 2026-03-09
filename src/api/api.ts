import axios from "axios";

const BASE_API_URL = "http://localhost:8000/"

const instance = axios.create({
    baseURL: BASE_API_URL,
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


export const photoProcessAPI = {
    processPhoto: (formData: FormData) => {
        return axios.post<ProcessPhotoResultType>("photo/process", formData, {
            baseURL: BASE_API_URL,
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },
    getResultPhoto: (photoId: number) => {
        return axios.get(`photo/result/${photoId}`, {
            responseType: "blob",
            baseURL: BASE_API_URL,
            withCredentials: true,
        });
    },
    getEnteredPhoto: (photoId: number) => {
        return instance.get(`photo/input/${photoId}`, {
            responseType: "blob",
            baseURL: BASE_API_URL,
            withCredentials: true,
        });
    }
}

type ProcessPhotoResultType = {
    id: number
    input_path: string
    output_path: string
    faces: number
    plates: number
}

export const photoHistoryAPI = {
    getPhotoHistory: (page: number, limit: number) => {
        return instance.get<PhotoHistoryType>(`history/?page=${page}&limit=${limit}`)
    },
    getPhotoInfo: (photoId: number) => {
        return instance.get<ProcessPhotoResultType>(`history/photo/${photoId}`)
    },
    deletePhoto: (photoId: number) => {
        return instance.delete<DeletePhotoResultType>(`history/delete/${photoId}`)
    }
}

type PhotoHistoryType = {
    photos: Array<ProcessPhotoResultType> 
}


type DeletePhotoResultType = {
    result: "success" | "failed"
}
