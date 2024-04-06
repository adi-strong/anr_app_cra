import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbJobsPages = 1

export const jobApiService = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueJob: build.query({
      query: id => apiPath+`/jobs/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getJobsList: build.query({
      query: pages => apiPath+`/jobs?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbJobsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getPaginatedJobsList: build.query({
      query: ({page, pages}) => apiPath+`/jobs?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbJobsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedJobsList: build.query({
      query: name => apiPath+`/jobs?name=${name}`,
      transformResponse: res => {
        nbJobsPages = 1
        return res['hydra:member']?.map(p => p)
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewJob: build.mutation({
      query: data => ({
        url: apiPath+`/jobs`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify({...data, service: data?.service ? data.service?.value : null})
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editJob: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/jobs/${data.id}`,
        body: JSON.stringify({...data, service: data?.service ? data.service?.value : null})
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
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          jobApiService.util.updateQueryData(
            'getJobsList', args?.pages, draft => {
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
      }
    }),
  
  })
})

export const {
  useGetUniqueJobQuery,
  useGetJobsListQuery,
  useLazyGetPaginatedJobsListQuery,
  useLazyGetSearchedJobsListQuery,
  
  usePostNewJobMutation,
  useEditJobMutation,
  useDeleteJobMutation,
} = jobApiService
