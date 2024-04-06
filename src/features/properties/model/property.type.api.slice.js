import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbPropertyTypesPages = 1

const propertyTypeApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getPropertyTypesList: build.query({
      query: pages => apiPath+`/property_types?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbPropertyTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniquePropertyType: build.query({
      query: id => apiPath+`/property_types/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedPropertyTypesList: build.query({
      query: ({page, pages}) => apiPath+`/property_types?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbPropertyTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getLoadPropertyTypes: build.query({
      query: name => apiPath+`/property_types?name=${name}`,
      transformResponse: res => {
        return res['hydra:member'].map(p => ({
          label: p?.name?.toUpperCase(),
          value: p['@id']
        }))
      }
    }),
    
    getSearchedPropertyTypesList: build.query({
      query: name => apiPath+`/property_types?name=${name}`,
      transformResponse: res => {
        nbPropertyTypesPages = 1
        return res['hydra:member']?.map(p => p)
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewPropertyType: build.mutation({
      query: data => ({
        url: apiPath+`/property_types`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editPropertyType: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/property_types/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(propertyTypeApiSlice.util.updateQueryData('getUniquePropertyType', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deletePropertyType: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/property_types/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          propertyTypeApiSlice.util.updateQueryData(
            'getPropertyTypesList', args?.pages, draft => {
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
  useGetPropertyTypesListQuery,
  useGetUniquePropertyTypeQuery,
  useLazyGetPaginatedPropertyTypesListQuery,
  useLazyGetLoadPropertyTypesQuery,
  useLazyGetSearchedPropertyTypesListQuery,
  
  usePostNewPropertyTypeMutation,
  useEditPropertyTypeMutation,
  useDeletePropertyTypeMutation,
} = propertyTypeApiSlice
