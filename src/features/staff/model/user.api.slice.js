import {api, apiPath} from "../../../app/store";

const userApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueUser: build.query({
      query: id => apiPath+`/users/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg,
      }]
    })
    
  })
})

export const {
  useGetUniqueUserQuery,
} = userApiSlice
