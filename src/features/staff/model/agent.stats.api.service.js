import {api, apiPath} from "../../../app/store";

const agentStatsApiService = api.injectEndpoints({
  endpoints: build => ({
    
    getActiveAgents: build.query({
      query: () => apiPath+'/active_agents',
      providesTags: ['LIST'],
    }),
    
    getInactiveAgents: build.query({
      query: () => apiPath+'/inactive_agents',
      providesTags: ['LIST'],
    }),
    
    getSickAgents: build.query({
      query: () => apiPath+'/sick_agents',
      providesTags: ['LIST'],
    }),
    
    getLeaveAgents: build.query({
      query: () => apiPath+'/leave_agents',
      providesTags: ['LIST'],
    }),
    
    getDeadAgents: build.query({
      query: () => apiPath+'/dead_agents',
      providesTags: ['LIST'],
    }),
    
    getUnavailableAgents: build.query({
      query: () => apiPath+'/unavailable_agents',
      providesTags: ['LIST'],
    }),
    
    getRetiredAgents: build.query({
      query: () => apiPath+'/retired_agents',
      providesTags: ['LIST'],
    }),
    
    getSoonRetiredAgents: build.query({
      query: () => apiPath+'/soon_retired_agents',
      providesTags: ['LIST'],
    }),
    
  })
})

export const {
  useGetActiveAgentsQuery,
  useGetInactiveAgentsQuery,
  useGetSickAgentsQuery,
  useGetLeaveAgentsQuery,
  useGetDeadAgentsQuery,
  useGetUnavailableAgentsQuery,
  useGetRetiredAgentsQuery,
  useGetSoonRetiredAgentsQuery,
} = agentStatsApiService
