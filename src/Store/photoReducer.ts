import { type ThunkAction, type UnknownAction, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "./store"

type PhotoStateType = {
    status: number
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>

const initialState: PhotoStateType = {
    status: 0
}

const photoSlice = createSlice({
    name: "photo",
    initialState,
    reducers: {}
})

// export const {} = photoSlice.actions



export default photoSlice
