import {api, apiPath, jsonLdHead} from "../../../app/store";

export let nbSalariesPages = 1

const salaryApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getSalariesList: build.query({
      query: pages => apiPath+`/salaries?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbSalariesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniqueSalary: build.query({
      query: id => apiPath+`/salaries/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedSalariesList: build.query({
      query: ({page, pages}) => apiPath+`/salaries?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbSalariesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewSalary: build.mutation({
      query: data => ({
        url: apiPath+`/salaries`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify({
          ...data,
          year: data?.year ? data.year?.value: null,
          total: data?.total?.toString(),
          baseAmount: data?.baseAmount?.toString(),
          riskPremiumAmount: data?.riskPremiumAmount?.toString(),
          functionBonusAmount: data?.functionBonusAmount?.toString(),
        })
      }),
      invalidatesTags: ['LIST'],
    }),
    
    postNewSalaryResource: build.mutation({
      query: data => ({
        url: apiPath+`/salary_resources`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify({
          ...data,
          yearId: data?.yearId ? parseInt(data.yearId) : parseInt(0),
          month: data?.month ? data.month?.toString() : null,
        })
      }),
      invalidatesTags: ['LIST'],
    }),
    
    searchSalaryResources: build.mutation({
      query: data => ({
        headers: jsonLdHead,
        method: 'POST',
        url: apiPath+'/search_salary_resources',
        body: JSON.stringify(data)
      })
    }),
  
  })
})

export const {
  useGetSalariesListQuery,
  useGetUniqueSalaryQuery,
  useLazyGetPaginatedSalariesListQuery,
  
  usePostNewSalaryMutation,
  usePostNewSalaryResourceMutation,
  useSearchSalaryResourcesMutation,
} = salaryApiSlice
