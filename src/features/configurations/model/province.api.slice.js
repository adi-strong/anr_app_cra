import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbProvincesPages = 1

const provinceApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getProvincesList: build.query({
      query: pages => apiPath+`/provinces?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbProvincesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getPaginatedProvincesList: build.query({
      query: ({page, pages}) => apiPath+`/provinces?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbProvincesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedProvincesList: build.query({
      query: name => apiPath+`/search_provinces/${name}`,
      transformResponse: res => {
        nbProvincesPages = 1
        return res?.map(p => p)
      }
    }),
    
    getUniqueProvince: build.query({
      query: id => apiPath+`/provinces/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getLoadProvinces: build.query({
      query: name => apiPath+`/provinces?name=${name}`,
      providesTags: result => result,
      transformResponse: res => {
        return res['hydra:member'].map(p => ({
          label: p?.name?.toUpperCase(),
          value: p['@id'],
          societies: p?.societies && p.societies?.length > 0 ? p.societies : []
        }))
      }
    }),
    
    
    // ****************************************************************************
    
    
    editProvince: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/provinces/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          dispatch(provinceApiSlice.util.updateQueryData('getUniqueProvince', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    addProvince: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/provinces',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
    
    deleteProvince: build.mutation({
      query: ({ id }) => ({
        method: 'DELETE',
        url: apiPath+`/provinces/${id}`,
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          provinceApiSlice.util.updateQueryData(
            'getProvincesList', args?.pages, draft => {
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
  useGetProvincesListQuery,
  useLazyGetPaginatedProvincesListQuery,
  useLazyGetSearchedProvincesListQuery,
  useLazyGetLoadProvincesQuery,
  
  useAddProvinceMutation,
  useEditProvinceMutation,
  useDeleteProvinceMutation,
} = provinceApiSlice
