import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbExpTypesPages = 1

const expTypeApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getExpTypesList: build.query({
      query: pages => apiPath+`/expense_types?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbExpTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getPaginatedExpTypesList: build.query({
      query: ({page, pages}) => apiPath+`/expense_types?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbExpTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedExpTypesList: build.query({
      query: name => apiPath+`/search_exp_types/${name}`,
      transformResponse: res => {
        nbExpTypesPages = 1
        return res?.map(p => ({...p, label: p?.name?.toUpperCase(), value: p['@id']}))
      }
    }),
    
    getUniqueExpType: build.query({
      query: id => apiPath+`/expense_types/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getLoadExpTypes: build.query({
      query: name => apiPath+`/expense_types?name=${name}`,
      transformResponse: res => {
        return res['hydra:member'].map(p => ({
          label: p.name.toUpperCase(),
          value: p['@id']
        }))
      }
    }),
    
    
    
    // ****************************************************************************
    
    
    editExpType: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/expense_types/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(expTypeApiSlice.util.updateQueryData('getUniqueExpType', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    addExpType: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/expense_types',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
    
    deleteExpType: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/expense_types/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          expTypeApiSlice.util.updateQueryData(
            'getExpTypesList', args?.pages, draft => {
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
    
  })
})

export const {
  useGetExpTypesListQuery,
  useLazyGetPaginatedExpTypesListQuery,
  useLazyGetSearchedExpTypesListQuery,
  useGetUniqueExpTypeQuery,
  useLazyGetLoadExpTypesQuery,
  
  useEditExpTypeMutation,
  useAddExpTypeMutation,
  useDeleteExpTypeMutation,
} = expTypeApiSlice
