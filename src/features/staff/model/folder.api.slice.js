import {api, apiPath} from "../../../app/store";

export const folderApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueFolder: build.query({
      query: id => apiPath+`/folders/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    
    // ****************************************************************************
    
    
    postNewFolder: build.mutation({
      query: data => ({
        url: apiPath+`/folders`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
    
    deleteFolder: build.mutation({
      query: ({ id }) => ({
        method: 'DELETE',
        url: apiPath+`/folders/${id}`,
        body: id,
      }),
      invalidatesTags: ['LIST'],
      /*async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          folderApiSlice.util.updateQueryData(
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
  useGetUniqueFolderQuery,
  
  usePostNewFolderMutation,
  useDeleteFolderMutation,
} = folderApiSlice
