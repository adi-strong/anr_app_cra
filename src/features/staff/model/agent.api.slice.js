import {api, apiPath, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbAgentsPages = 1

const agentApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    postNewAgent: build.mutation({
      query: data => ({
        url: apiPath+`/agents`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
    
    getAgentsList: build.query({
      query: pages => apiPath+`/agents?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbAgentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniqueAgent: build.query({
      query: id => apiPath+`/agents/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedAgentsList: build.query({
      query: ({page, pages}) => apiPath+`/agents?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbAgentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedAgentsList: build.query({
      query: keyword => apiPath+`/search_agents/${keyword}`,
      transformResponse: res => {
        nbAgentsPages = 1
        return res?.map(p => p)
      }
    }),
    
    getLoadAgents: build.query({
      query: name => apiPath+`/search_agents/${name}`,
      providesTags: result => result,
      transformResponse: res => {
        return res?.map(p => ({
          label: p?.name?.toUpperCase()+' '+(p?.firstName ? p.firstName.toUpperCase()+' ' : ''),
          value: `/api/agents/${p.id}`,
          province: p?.province,
          department: p?.department,
          grade: p?.grade,
          service: p?.service,
          job: p?.job,
        }))
      }
    }),
    
    
    // ****************************************************************************
    
    
    editAgent: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/agents/${data.id}`,
        body: JSON.stringify({
          ...data,
          department: data?.department ? data.department?.value : null,
          province: data?.province ? data.province?.value : null,
          grade: data?.grade ? data.grade?.data : null,
          job: data?.job ? data.job?.data : null,
          service: data?.service ? data.service?.data : null,
        })
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(agentApiSlice.util.updateQueryData('getUniqueAgent', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteAgentProfile: build.mutation({
      query: ({ id }) => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/agents/${id}/delete-profile`,
        body: JSON.stringify({ })
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(agentApiSlice.util.updateQueryData('getUniqueAgent', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteAgent: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/agents/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
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
      }
    }),
    
    updateAgentProfile: build.mutation({
      query: data => ({
        method: 'POST',
        url: apiPath+`/agents/profile-edit`,
        body: data.formData
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(agentApiSlice.util.updateQueryData('getUniqueAgent', args?.id?.toString(), draft => {
            Object.assign(draft, {
              ...draft,
              profile: patchResult,
            })
          }))
        }
        catch (e) { }
      }
    }),
    
  })
})

export const {
  usePostNewAgentMutation,
  useEditAgentMutation,
  useDeleteAgentMutation,
  useUpdateAgentProfileMutation,
  useDeleteAgentProfileMutation,
  
  useGetAgentsListQuery,
  useGetUniqueAgentQuery,
  useLazyGetPaginatedAgentsListQuery,
  useLazyGetSearchedAgentsListQuery,
  useLazyGetLoadAgentsQuery,
} = agentApiSlice
