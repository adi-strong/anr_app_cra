import {api} from "../../../app/store";

const authApiSlice = api.injectEndpoints({
  endpoints: build => ({
  
    auth: build.mutation({
      query: data => ({
        method: 'POST',
        url: '/auth',
        body: data,
      })
    })
  
  })
})

export const {useAuthMutation} = authApiSlice
