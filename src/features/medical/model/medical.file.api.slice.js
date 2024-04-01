import {api, apiPath} from "../../../app/store";

const medicalFileApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueMedicalFile: build.query({
      query: id => apiPath+`/medical_files/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    
    // ****************************************************************************
    
    
    postNewMedicalFile: build.mutation( {
      query: data => ({
        url: apiPath+`/medical_files`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
    
    deleteMedicalFile: build.mutation({
      query: ({ id }) => ({
        method: 'DELETE',
        url: apiPath+`/medical_files/${id}`,
        body: id,
      }),
      invalidatesTags: ['LIST'],
      /*async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          medicalFileApiSlice.util.updateQueryData(
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
  useGetUniqueMedicalFileQuery,
  
  usePostNewMedicalFileMutation,
  useDeleteMedicalFileMutation,
} = medicalFileApiSlice
