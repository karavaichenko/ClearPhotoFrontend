import { accountAPI, authAPI, type AccountInfoResponse } from './../api/api';
import { type PayloadAction, type ThunkAction, type UnknownAction, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "./store"


type AccountStateType = {
    login: string | null,
    email: string | null,
    photoCount: number
    changePassStatus: boolean | null
}


export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>

const initialState: AccountStateType = {
    login: null,
    email: null,
    photoCount: 0,
    changePassStatus: null
}

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setAccountInfo: (state, accountInfo: PayloadAction<AccountInfoResponse>) => {
            state.login = accountInfo.payload.login
            state.email = accountInfo.payload.email
            state.photoCount = accountInfo.payload.photoCount
        },
        setChangePassStatus: (state, status: PayloadAction<boolean | null>) => {
            state.changePassStatus = status.payload
        }
    }
})

export const { setAccountInfo, setChangePassStatus } = accountSlice.actions

export const getAccountInfoThunk = (): AppThunk => (dispatch) => {
    accountAPI.getAccountInfo().then(reqRes => {
        dispatch(setAccountInfo(reqRes.data))
    }).catch((error) => {
        if (error.respose?.status === 500) {
            //
        } else if (error.response?.status === 401) {
            // редирект на логин
        } else {
            console.log(error);
        }
    })
}

export const changePasswordThunk = (oldPass: string, newPass: string): AppThunk => (dispatch) => {
    authAPI.changePassword(oldPass, newPass).then((reqRes) => {
        if (reqRes.data.result === 'success') {
            dispatch(setChangePassStatus(true))
        } else {
            dispatch(setChangePassStatus(false))
        }
    }).catch(error => {
        if (error.response?.status === 401) {
            // редирект на логин
        } else {
            console.log(error);
        }
    })
}


export default accountSlice

