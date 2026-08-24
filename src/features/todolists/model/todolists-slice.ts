import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
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
      (title: string) => ({ payload: { title, id: nanoid() } }),
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

export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetchTodolistsTC`, async (_, thunkAPI) => {
  try {
    const res = await todolistsApi.getTodolists()
    thunkAPI.dispatch(setTodolistsAC({ todolists: res.data }))
  } catch (e) {
    console.log(e)
  }
})

export const todolistsReducer = todolistsSlice.reducer
export const { deleteTodolistAC, createTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, setTodolistsAC } =
  todolistsSlice.actions
