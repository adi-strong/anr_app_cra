import {createSlice} from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

const jwt = localStorage.getItem('authToken') ? localStorage.getItem('authToken') : null

const initialState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setup: state => {
      if (jwt) {
        const {id, username, fullName, roles, phone, email} = jwtDecode(jwt)
        
        state.token = jwt
        state.user = {id, username, fullName, roles, phone, email}
      }
    },
    
    getCredentials: (state, action) => {
      const {id, username, fullName, roles, phone, email} = jwtDecode(action.payload)
      
      state.token = action.payload
      state.user = {id, username, fullName, roles, phone, email}
      
      localStorage.setItem('authToken', state.token)
    },
    
    logout: state => {
      state.user = null
      state.token = null
      localStorage.removeItem('authToken')
    },
    
    setAuthUser: (state, action) => {
      state.user = {
        id: action.payload.id,
        username: action.payload?.username,
        fullName: action.payload.fullName,
        roles: action.payload.roles,
        phone: action.payload.phone,
        email: action.payload.email,
        image: action.payload.image,
      }
    },
  }
})

export const {
  setup,
  logout,
  setAuthUser,
  getCredentials,
} = authSlice.actions

export default authSlice.reducer
