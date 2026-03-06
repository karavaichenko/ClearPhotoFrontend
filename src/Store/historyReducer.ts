import { type ThunkAction, type UnknownAction, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "./store"

type HistoryStateType = {
    photos: Array<string>
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>

const initialState: HistoryStateType = {
    photos: []
}

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {}
})

// export const {} = historySlice.actions



export default historySlice
