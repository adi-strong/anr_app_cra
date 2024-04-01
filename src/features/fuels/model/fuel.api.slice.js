import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";

export const fuelApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueFuel: build.query({
      query: id => apiPath+`/fuels/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    
    // ****************************************************************************
    
    
    postNewFuel: build.mutation({
      query: data => ({
        url: apiPath+`/fuels`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
    
    postNewFuelSupply: build.mutation({
      query: data => ({
        url: apiPath+`/fuel_supplies`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify({...data, createdAt: data?.createdAt ? data.createdAt : null})
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editFuel: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/fuels/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(fuelApiSlice.util.updateQueryData('getUniqueFuel', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteFuel: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/fuels/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      /*async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          fuelApiSlice.util.updateQueryData(
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
  useGetUniqueFuelQuery,
  
  usePostNewFuelMutation,
  useEditFuelMutation,
  useDeleteFuelMutation,
  usePostNewFuelSupplyMutation,
} = fuelApiSlice
