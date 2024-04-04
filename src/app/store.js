import {configureStore} from '@reduxjs/toolkit';
import {createApi, fetchBaseQuery, setupListeners} from "@reduxjs/toolkit/query/react";
import configReducer from '../features/config/config.slice';
import authReducer from '../features/auth/services/auth.slice';

// export const entrypoint = 'https://localhost:8000'
// https://test-ops-api.mdeservicesdrc.com/
export const entrypoint = 'https://localhost:8000'

export const apiPath = '/api'

export const patchHead = {
  'Accept': 'application/ld+json',
  'Content-Type': 'application/merge-patch+json',
}

export const jsonLdHead = {
  'Accept': 'application/ld+json',
  'Content-Type': 'application/ld+json',
}

const baseQuery = fetchBaseQuery({
  baseUrl: entrypoint,
  mode: 'cors',
  prepareHeaders: (headers, {getState}) => {
    const token = getState().auth.token
      ? getState().auth.token
      : localStorage.getItem('authToken')
        ? localStorage.getItem('authToken')
        : null
    if (token) headers.set('authorization',`Bearer ${token}`)
    return headers
  }
})

export const api = createApi({
  reducerPath: 'api',
  refetchOnReconnect: true,
  refetchOnMountOrArgChangeen: 5,
  baseQuery,
  endpoints: build => ({}),
  tagTypes: [
    'LIST',
    'UNIQUE',
  ]
})

export const store = configureStore({
  reducer: {
    config: configReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: gDM => gDM().concat(api.middleware),
  devTools: true,
});

setupListeners(store.dispatch)
