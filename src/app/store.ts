import { configureStore } from "@reduxjs/toolkit"
import { appReducer, appSlice } from "./app-slice"
import { todolistsReducer, todolistsSlice } from "@/features/todolists/model/todolists-slice"
import { tasksReducer, tasksSlice } from "@/features/todolists/model/tasks-slice"

// создание store
export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [todolistsSlice.name]: todolistsReducer,
    [tasksSlice.name]: tasksReducer,
  },
})

// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch

