import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";

export const jobApiService = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueJob: build.query({
      query: id => apiPath+`/jobs/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    
    // ****************************************************************************
    
    
    postNewJob: build.mutation({
      query: data => ({
        url: apiPath+`/jobs`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editJob: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/jobs/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(jobApiService.util.updateQueryData('getUniqueJob', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteJob: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/jobs/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      /*async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          jobApiService.util.updateQueryData(
            'getAssignmentsList', args?.pages, draft => {
              const p = draft?.find(item => item.id === args.id)
              if (p) return draft?.filter(item => item.id !== args.id)
            })
        )
        
        try {
          await queryFulfilled
          toast.success('Suppression bien efféctuée.')
        }
        catch {
          patchResult.undo()
        }
      }*/
    }),
  
  })
})

export const {
  useGetUniqueJobQuery,
  
  usePostNewJobMutation,
  useEditJobMutation,
  useDeleteJobMutation,
} = jobApiService
