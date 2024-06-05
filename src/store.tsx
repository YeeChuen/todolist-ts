import { configureStore } from '@reduxjs/toolkit'
import todolistReducer from './slice/slice'

export const store = configureStore({
  reducer: {
    todos: todolistReducer,
  },
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch