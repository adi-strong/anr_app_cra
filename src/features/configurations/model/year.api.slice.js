import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";

export let nbYearsPages = 1

const yearApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getYearsList: build.query({
      query: pages => apiPath+`/years?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbYearsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getPaginatedYearsList: build.query({
      query: ({page, pages}) => apiPath+`/years?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbYearsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedYearsList: build.query({
        query: name => apiPath+`/search_years/${name}`,
      transformResponse: res => {
        nbYearsPages = 1
        return res?.map(p => p)
      }
    }),
    
    getUniqueYear: build.query({
      query: id => apiPath+`/years/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    
    // ****************************************************************************
    
    
    editYear: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/years/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(yearApiSlice.util.updateQueryData('getYearsList', args?.pages, draft => {
            Object.assign(draft, {...patchResult})
          }))
          
          dispatch(yearApiSlice.util.updateQueryData('getUniqueYear', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    addYear: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/years',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
    
  })
})

export const {
  useGetYearsListQuery,
  useLazyGetPaginatedYearsListQuery,
  useLazyGetSearchedYearsListQuery,
  useGetUniqueYearQuery,
  
  useEditYearMutation,
  useAddYearMutation,
} = yearApiSlice
