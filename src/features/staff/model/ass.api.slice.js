import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbAssignmentsPages = 1

const assApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getAssignmentsList: build.query({
      query: pages => apiPath+`/assignments?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbAssignmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniqueAssignment: build.query({
      query: id => apiPath+`/assignments/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedAssignmentsList: build.query({
      query: ({page, pages}) => apiPath+`/assignments?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbAssignmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewAssignment: build.mutation({
      query: data => ({
        url: apiPath+`/assignments`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify({
          ...data,
          destination: data?.destination ? data.destination?.value : null,
          province: data?.province ? data.province?.value : null,
          startAt: data?.startAt ? data.startAt : null,
          endAt: data?.endAt ? data.endAt : null,
        })
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editAssignment: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/assignments/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(assApiSlice.util.updateQueryData('getUniqueAssignment', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteAssignment: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/assignments/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          assApiSlice.util.updateQueryData(
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
      }
    }),
    
  })
})

export const {
  useGetAssignmentsListQuery,
  useGetUniqueAssignmentQuery,
  useLazyGetPaginatedAssignmentsListQuery,
  
  usePostNewAssignmentMutation,
  useEditAssignmentMutation,
  useDeleteAssignmentMutation,
} = assApiSlice
