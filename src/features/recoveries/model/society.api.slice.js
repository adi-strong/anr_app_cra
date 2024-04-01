import {api, apiPath, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbSocietiesPages = 1

const societyApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getSocietiesList: build.query({
      query: pages => apiPath+`/societies?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbSocietiesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniqueSociety: build.query({
      query: id => apiPath+`/societies/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedSocietiesList: build.query({
      query: ({page, pages}) => apiPath+`/societies?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbSocietiesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedSocietiesList: build.query({
      query: name => apiPath+`/societies?name=${name}`,
      transformResponse: res => {
        nbSocietiesPages = 1
        return res['hydra:member']?.map(p => p)
      }
    }),
    
    getLoadSocieties: build.query({
      query: name => apiPath+`/societies?name=${name}`,
      providesTags: result => result,
      transformResponse: res => {
        return res['hydra:member']?.map(p => ({
          label: p?.name?.toUpperCase(),
          value: p['@id'],
        }))
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewSociety: build.mutation({
      query: data => ({
        url: apiPath+`/societies`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editSociety: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/societies/${data.id}`,
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
          
          dispatch(societyApiSlice.util.updateQueryData('getUniqueSociety', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteSociety: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/societies/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          societyApiSlice.util.updateQueryData(
            'getSocietiesList', args?.pages, draft => {
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
  useGetSocietiesListQuery,
  useGetUniqueSocietyQuery,
  useLazyGetPaginatedSocietiesListQuery,
  useLazyGetSearchedSocietiesListQuery,
  useLazyGetLoadSocietiesQuery,
  
  usePostNewSocietyMutation,
  useEditSocietyMutation,
  useDeleteSocietyMutation,
} = societyApiSlice
