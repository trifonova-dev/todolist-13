import { createSlice, nanoid } from "@reduxjs/toolkit"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = Todolist & { filter: FilterValues }

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => ({
        payload: { title, id: nanoid() },
      }),
      (state, action) => {
        state.push({ ...action.payload, filter: "all", addedDate: "", order: 0 })
      },
    ),
    setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((_state, action) => {
      return action.payload.todolists.map((tl) => {
        return { ...tl, filter: "all" }
      })
    }),
  }),
})

export const { deleteTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, createTodolistAC, setTodolistsAC } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
