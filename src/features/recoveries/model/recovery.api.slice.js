import {api, apiPath} from "../../../app/store";

const recoveryApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueRecovery: build.query({
      query: id => apiPath+`/society_recoveries/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    postNewRecovery: build.mutation({
      query: data => ({
        url: apiPath+`/society_recoveries`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
  
  })
})

export const {
  useGetUniqueRecoveryQuery,
  usePostNewRecoveryMutation,
} = recoveryApiSlice
