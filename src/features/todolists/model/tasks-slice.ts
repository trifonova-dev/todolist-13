import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { tasksApi } from "@/features/todolists/api/tasksApi"
import type { RootState } from "@/app/store"
import type { UpdateTaskModel } from "@/features/todolists/api/tasksApi.types"

export type Task = {
  id: string
  title: string
  isDone: boolean
  description: string
  status: number
  priority: number
  startDate: string
  deadline: string
  todoListId: string
  order: number
  addedDate: string
}

export type TasksState = Record<string, Task[]>

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: {},
  selectors: {
    selectTasks: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.meta.arg] = action.payload
      })
      .addCase(createTaskTC.fulfilled, (state, action) => {
        const todolistId = action.meta.arg.todolistId
        if (!state[todolistId]) {
          state[todolistId] = []  // создаю массив если его нет
        }
        state[action.meta.arg.todolistId].unshift(action.payload)
      })
      .addCase(deleteTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) {
          tasks.splice(index, 1)
        }
      })
      .addCase(changeTaskStatusTC.fulfilled, (state, action) => {
        const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
        if (task) {
          task.status = action.payload.status
        }
      })
      .addCase(changeTaskTitleTC.fulfilled, (state, action) => {
        const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
        if (task) {
          task.title = action.payload.title
        }
      })
  }
})

export const fetchTasksTC = createAsyncThunk<Task[], string, { rejectValue: string }>(
  `${tasksSlice.name}/fetchTasksTC`,
  async (todolistId, { rejectWithValue }: { rejectWithValue: (value: string) => any }) => {
    try {
      const res = await tasksApi.getTasks(todolistId)
      return res.data.items
    }
    catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

export const createTaskTC = createAsyncThunk<Task, { todolistId: string; title: string }, { rejectValue: string }>(
  `${tasksSlice.name}/createTaskTC`,
  async (arg, { rejectWithValue }: {
    rejectWithValue: (value: string) => any
  }) => {
    try {
      const res = await tasksApi.createTask({ title: arg.title, todolistId: arg.todolistId })
      console.log("Ответ сервера:", res.data.data.item)
      return res.data.data.item
    }
    catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

export const deleteTaskTC = createAsyncThunk<{ todolistId: string; taskId: string }, {
  todolistId: string;
  taskId: string
}, { rejectValue: string }>(
  `${tasksSlice.name}/deleteTaskTC`,
  async (arg, { rejectWithValue }: {
    rejectWithValue: (value: string) => any
  }) => {
    try {
      await tasksApi.deleteTask({ todolistId: arg.todolistId, taskId: arg.taskId })
      return { todolistId: arg.todolistId, taskId: arg.taskId }
    }
    catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

export const changeTaskStatusTC = createAsyncThunk<{ todolistId: string; taskId: string; status: number }, {
  todolistId: string;
  taskId: string;
  status: number
}, { rejectValue: string, state: RootState }>(
  `${tasksSlice.name}/changeTaskStatusTC`,
  async (arg, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
      if (!task) {
        return rejectWithValue("Task not found")
      }
      const model: UpdateTaskModel = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        status: arg.status
      }
      await tasksApi.updateTask({ todolistId: arg.todolistId, taskId: arg.taskId }, model, { todolistId: arg.todolistId, taskId: arg.taskId, model })
      return { todolistId: arg.todolistId, taskId: arg.taskId, status: arg.status }
    }
    catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

export const changeTaskTitleTC = createAsyncThunk<{ todolistId: string; taskId: string; title: string }, {
  todolistId: string;
  taskId: string;
  title: string
}, { rejectValue: string, state: RootState }>(
  `${tasksSlice.name}/changeTaskTitleTC`,
  async (arg, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
      if (!task) {
        return rejectWithValue("Task not found")
      }
      const model: UpdateTaskModel = {
        title: arg.title,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        status: task.status
      }
      await tasksApi.updateTask({ todolistId: arg.todolistId, taskId: arg.taskId }, model,{ todolistId: arg.todolistId, taskId: arg.taskId, model })
      return { todolistId: arg.todolistId, taskId: arg.taskId, title: arg.title }
    }
    catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)


export const { selectTasks } = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer


