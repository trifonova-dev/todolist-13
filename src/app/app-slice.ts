import { createSlice } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode
  },
  reducers: (create) => {
    return {
      changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
        state.themeMode = action.payload.themeMode
      })
    }
  }
})

export type ThemeMode = "dark" | "light"

export const { changeThemeModeAC } = appSlice.actions
export const { selectThemeMode } = appSlice.selectors
export const appReducer = appSlice.reducer
