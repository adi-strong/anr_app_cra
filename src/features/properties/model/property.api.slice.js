import {api, apiPath, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbPropertiesPages = 1

const propertyApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getPropertiesList: build.query({
      query: pages => apiPath+`/properties?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbPropertiesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniqueProperty: build.query({
      query: id => apiPath+`/properties/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedPropertiesList: build.query({
      query: ({page, pages}) => apiPath+`/properties?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbPropertiesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedPropertiesList: build.query({
      query: keyword => apiPath+`/search_properties/${keyword}`,
      transformResponse: res => {
        nbPropertiesPages = 1
        return res?.map(p => p)
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewProperty: build.mutation({
      query: data => ({
        url: apiPath+`/properties`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editProperty: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/properties/${data.id}`,
        body: JSON.stringify({
          ...data,
          province: data?.province ? data.province?.value : null,
          type: data?.type ? data.type?.value : null,
        })
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(propertyApiSlice.util.updateQueryData('getUniqueProperty', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteProperty: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/properties/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          propertyApiSlice.util.updateQueryData(
            'getPropertiesList', args?.pages, draft => {
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
  useGetPropertiesListQuery,
  useGetUniquePropertyQuery,
  useLazyGetPaginatedPropertiesListQuery,
  useLazyGetSearchedPropertiesListQuery,
  
  usePostNewPropertyMutation,
  useEditPropertyMutation,
  useDeletePropertyMutation,
} = propertyApiSlice
