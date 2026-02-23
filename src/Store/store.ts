import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authReducer";
import photoSlice from "./photoReducer";
import historySlice from "./historyReducer";

const authReducer = authSlice.reducer
const photoReducer = photoSlice.reducer
const historyReducer = historySlice.reducer

const store = configureStore({
    reducer: {
        auth: authReducer,
        photo: photoReducer,
        history: historyReducer,
    },
    // middleware: getDefaultMiddleware =>
    // getDefaultMiddleware({
    //   thunk: {
    //     extraArgument: { serviceApi }
    //   }
    // })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store