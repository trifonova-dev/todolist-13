import { createSlice, nanoid } from "@reduxjs/toolkit"
import { createTodolistAC, createTodolistTC, deleteTodolistAC } from "./todolists-slice"

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => ({
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.isDone = action.payload.isDone
      }
    }),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
    createTaskAC: create.preparedReducer(
      ({ title, todolistId }) => ({
        payload: { title, id: nanoid(), todolistId },
      }),
      (state, action) => {
        // console.log("action.payload:", action.payload)
        // console.log("state:", state)
        // console.log("todolistId:", action.payload.todolistId)

        if (!state[action.payload.todolistId]) {
          state[action.payload.todolistId] = []
        }

        const newTask = {
          id: action.payload.id,
          title: action.payload.title,
          isDone: false,
        }
        state[action.payload.todolistId].unshift(newTask)
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.item.id] = []
      })
      .addCase(deleteTodolistAC, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const { createTaskAC, deleteTaskAC, changeTaskTitleAC, changeTaskStatusAC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors
