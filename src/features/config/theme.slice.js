import {createSlice} from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: 'theme',
  initialState: {show: false, theme: 'light'},
  reducers: {
    toggleShowTheme: state => {
      const show = !state.show
      state.show = show
      state.theme = show ? 'dark' : 'light'
    }
  }
})

export const {toggleShowTheme} = themeSlice.actions

export default themeSlice.reducer
