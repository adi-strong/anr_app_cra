import {api, apiPath, patchHead} from "../../../app/store";

const medicalApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueMedical: build.query({
      query: id => apiPath+`/medicals/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    
    // ****************************************************************************
    
    
    postNewMedical: build.mutation({
      query: data => ({
        url: apiPath+`/medicals`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editMedical: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/medicals/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(medicalApiSlice.util.updateQueryData('getUniqueMedical', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteMedical: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/medicals/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      /*async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          medicalApiSlice.util.updateQueryData(
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
  useGetUniqueMedicalQuery,
  
  usePostNewMedicalMutation,
  useEditMedicalMutation,
  useDeleteMedicalMutation,
} = medicalApiSlice
