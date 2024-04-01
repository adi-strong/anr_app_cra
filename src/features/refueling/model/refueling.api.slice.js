import {api, apiPath, jsonLdHead} from "../../../app/store";
import {nbAssignmentsPages} from "../../staff/model/ass.api.slice";

const refuelingApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueRefueling: build.query({
      query: id => apiPath+`/refuelings/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedRefuelingList: build.query({
      query: ({page, pages}) => apiPath+`/refuelings?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbAssignmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewRefueling: build.mutation({
      query: data => ({
        url: apiPath+`/refuelings`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
  
  })
})

export const {
  useGetUniqueRefuelingQuery,
  useLazyGetPaginatedRefuelingListQuery,
  
  usePostNewRefuelingMutation,
} = refuelingApiSlice
