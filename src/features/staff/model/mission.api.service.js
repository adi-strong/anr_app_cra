import {api, apiPath, patchHead} from "../../../app/store";

export const missionApiService = api.injectEndpoints({
  endpoints: build => ({
    
    postNewMission: build.mutation({
      query: data => ({
        url: apiPath+`/missions`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
    
    getUniqueMission: build.query({
      query: id => apiPath+`/missions/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    
    // ****************************************************************************
    
    
    editMission: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/missions/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(missionApiService.util.updateQueryData('getUniqueMission', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteMission: build.mutation({
      query: ({ id }) => ({
        // headers: patchHead,
        method: 'DELETE',
        url: apiPath+`/missions/${id}`,
        body: id,
      }),
      invalidatesTags: ['LIST'],
      /*async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          agentApiSlice.util.updateQueryData(
            'getAgentsList', args?.pages, draft => {
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
  useGetUniqueMissionQuery,
  
  usePostNewMissionMutation,
  useEditMissionMutation,
  useDeleteMissionMutation,
} = missionApiService
