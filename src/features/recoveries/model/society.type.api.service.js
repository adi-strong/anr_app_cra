import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbSocietyTypesPages = 1

const societyTypeApiService = api.injectEndpoints({
  endpoints: build => ({
    
    getSocietyTypesList: build.query({
      query: pages => apiPath+`/society_types?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbSocietyTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniqueSocietyType: build.query({
      query: id => apiPath+`/society_types/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedSocietyTypesList: build.query({
      query: ({page, pages}) => apiPath+`/society_types?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbSocietyTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedSocietyTypesList: build.query({
      query: name => apiPath+`/society_types?name=${name}`,
      transformResponse: res => {
        nbSocietyTypesPages = 1
        return res['hydra:member']?.map(p => p)
      }
    }),
    
    getLoadSocietyTypes: build.query({
      query: name => apiPath+`/society_types?name=${name}`,
      providesTags: result => result,
      transformResponse: res => {
        return res['hydra:member']?.map(p => ({
          label: p?.name?.toUpperCase(),
          value: p['@id'],
        }))
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewSocietyType: build.mutation({
      query: data => ({
        url: apiPath+`/society_types`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify({
          ...data,
          province: data?.province ? data.province?.value : null,
        })
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editSocietyType: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/society_types/${data.id}`,
        body: JSON.stringify({
          ...data,
          province: data?.province ? data.province?.value : null,
        })
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(societyTypeApiService.util.updateQueryData('getUniqueSocietyType', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteSocietyType: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/society_types/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          societyTypeApiService.util.updateQueryData(
            'getSocietyTypesList', args?.pages, draft => {
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
  useGetSocietyTypesListQuery,
  useGetUniqueSocietyTypeQuery,
  useLazyGetPaginatedSocietyTypesListQuery,
  useLazyGetSearchedSocietyTypesListQuery,
  useLazyGetLoadSocietyTypesQuery,
  
  usePostNewSocietyTypeMutation,
  useEditSocietyTypeMutation,
  useDeleteSocietyTypeMutation,
} = societyTypeApiService
