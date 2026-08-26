import { configureStore } from "@reduxjs/toolkit"
import { appSlice } from "@/app/app-slice"
import { tasksReducer, tasksSlice } from "@/features/todolists/model/tasks-slice"
import { todolistsReducer, todolistsSlice } from "@/features/todolists/model/todolists-slice"

// создание store
export const store = configureStore({
  reducer: {
    [appSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [tasksSlice.name]: tasksReducer,
  },
})

// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch
