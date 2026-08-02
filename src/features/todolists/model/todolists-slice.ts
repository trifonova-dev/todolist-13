import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"

export type DomainTodolist = Todolist & { filter: FilterValues }

export type FilterValues = "all" | "active" | "completed"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state
  },
  reducers: (create) => ({
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    })
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        return action.payload.map(tl => ({ ...tl, filter: "all" }))
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload, filter: "all" })
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
  }
})

export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetchTodolistsTC`, async (
    _arg, { rejectWithValue }) => {
    try {
      const res = await todolistsApi.getTodolists()
      return res.data
    }
    catch (e) {
      return rejectWithValue(e)
    }
  }
)
export const changeTodolistTitleTC =
  createAsyncThunk<Todolist, { id: string, title: string }>(
    `${todolistsSlice.name}/changeTodolistTitleTC`,
    async (args, { rejectWithValue }) => {
      try {
        const res = await todolistsApi.changeTodolistTitle(args)
        return res.data.data
      }
      catch (e) {
        return rejectWithValue(e)
      }
    })

export const createTodolistTC =
  createAsyncThunk<Todolist, string>(
    `${todolistsSlice.name}/createTodolistTC`, async (
      title, { rejectWithValue }) => {
      try {
        const res = await todolistsApi.createTodolist(title)
        return res.data.data.item
      }
      catch (e) {
        return rejectWithValue(e)
      }
    }
  )
export const deleteTodolistTC =
  createAsyncThunk<{ id: string }, { id: string }>(
    `${todolistsSlice.name}/deleteTodolistTC`, async (arg, { rejectWithValue }) => {
      try {
        await todolistsApi.deleteTodolist(arg.id)
        return { id: arg.id }
      }
      catch (e) {
        return rejectWithValue(e)
      }
    }
  )


export const { changeTodolistFilterAC } = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors

export const todolistsReducer = todolistsSlice.reducer

