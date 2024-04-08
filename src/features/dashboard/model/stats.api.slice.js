import {api, apiPath} from "../../../app/store";

const statsApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getSynthesisStats: build.query({
      query: () => apiPath+'/get_synthesis_stats',
    }),
    
    getThisMonthFinancesStats: build.query({
      query: () => apiPath+'/get_this_month_finances_stats',
    }),
    
    getLastMonthFinancesStats: build.query({
      query: () => apiPath+'/get_last_month_finances_stats',
    }),
    
    getFinancesStats: build.query({
      query: () => apiPath+'/get_finances_stats',
    }),
  
  })
})

export const {
  useGetSynthesisStatsQuery,
  useGetThisMonthFinancesStatsQuery,
  
  useLazyGetLastMonthFinancesStatsQuery,
  useLazyGetFinancesStatsQuery,
} = statsApiSlice
