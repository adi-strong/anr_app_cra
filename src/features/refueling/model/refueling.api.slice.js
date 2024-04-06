import {api, apiPath, jsonLdHead} from "../../../app/store";

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
        // nbAssignmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewRefueling: build.mutation({
      query: data => ({
        url: apiPath+`/refuelings`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify({
          ...data,
          quantity: data?.quantity ? parseFloat(data.quantity) : parseFloat(0),
          site: data?.site ? data.site?.value : null,
          vehicle: data?.vehicle ? data.vehicle?.value : null,
          fuel: data?.fuel ? data.fuel?.data : null,
          agent: data?.agent ? data.agent?.value : null,
        })
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
