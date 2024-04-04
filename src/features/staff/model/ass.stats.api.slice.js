import {api, apiPath} from "../../../app/store";

const assStatsApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getCurrentAssignments: build.query({
      query: () => apiPath+'/current_assignments',
      providesTags: ['LIST'],
    }),
    
    getAssignmentsNearExpirations: build.query({
      query: () => apiPath+'/assignments_near_expirations',
      providesTags: ['LIST'],
    }),
    
  })
})

export const {
  useGetCurrentAssignmentsQuery,
  useGetAssignmentsNearExpirationsQuery,
} = assStatsApiSlice
