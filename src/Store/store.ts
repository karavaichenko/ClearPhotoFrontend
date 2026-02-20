import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authReducer";

const authReducer = authSlice.reducer
const store = configureStore({
    reducer: {
        auth: authReducer,
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