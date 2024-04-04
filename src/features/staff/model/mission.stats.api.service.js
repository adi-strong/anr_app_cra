import {api, apiPath} from "../../../app/store";

const missionStatsApiService = api.injectEndpoints({
  endpoints: build => ({
    
    getCurrentMissions: build.query({
      query: () => apiPath+'/current_missions',
      providesTags: ['LIST'],
    }),
    
    getMissionsNerExpirations: build.query({
      query: () => apiPath+'/missions_near_expirations',
      providesTags: ['LIST'],
    }),
    
  })
})

export const {
  useGetCurrentMissionsQuery,
  useGetMissionsNerExpirationsQuery,
} = missionStatsApiService
