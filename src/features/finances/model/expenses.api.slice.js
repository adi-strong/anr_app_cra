import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbExpensePages = 1

const expensesApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getExpensesList: build.query({
      query: pages => apiPath+`/expenses?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbExpensePages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getPaginatedExpensesList: build.query({
      query: ({page, pages}) => apiPath+`/expenses?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbExpensePages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedExpensesList: build.query({
      query: name => apiPath+`/search_expenses/${name}`,
      transformResponse: res => {
        nbExpensePages = 1
        return res?.map(p => p)
      }
    }),
    
    getUniqueExpense: build.query({
      query: id => apiPath+`/expenses/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    
    // ****************************************************************************
    
    
    editExpense: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/expenses/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(expensesApiSlice.util.updateQueryData('getUniqueExpense', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    addExpense: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/expenses',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
    
    deleteExpense: build.mutation({
      query: ({ id }) => ({
        // headers: patchHead,
        method: 'DELETE',
        url: apiPath+`/expenses/${id}`,
        body: id,
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          expensesApiSlice.util.updateQueryData(
            'getExpensesList', args?.pages, draft => {
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
    
    searchExpenseReportResources: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/search_expense_resources',
        body: JSON.stringify(data),
      }),
    }),
    
  })
})

export const {
  useGetExpensesListQuery,
  useGetUniqueExpenseQuery,
  useLazyGetPaginatedExpensesListQuery,
  useLazyGetSearchedExpensesListQuery,
  
  useAddExpenseMutation,
  useEditExpenseMutation,
  useDeleteExpenseMutation,
  useSearchExpenseReportResourcesMutation,
} = expensesApiSlice
