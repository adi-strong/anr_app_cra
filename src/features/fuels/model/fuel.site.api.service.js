import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbFuelSitesPages = 1

const fuelSiteApiService = api.injectEndpoints({
  endpoints: build => ({
    
    getFuelSitesList: build.query({
      query: pages => apiPath+`/fuel_sites?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbFuelSitesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniqueFuelSite: build.query({
      query: id => apiPath+`/fuel_sites/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedFuelSitesList: build.query({
      query: ({page, pages}) => apiPath+`/fuel_sites?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbFuelSitesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedFuelSitesList: build.query({
      query: name => apiPath+`/fuel_sites?name=${name}`,
      transformResponse: res => {
        nbFuelSitesPages = 1
        return res['hydra:member']?.map(p => p)
      }
    }),
    
    getLoadFuelSites: build.query({
      query: name => apiPath+`/fuel_sites?name=${name}`,
      transformResponse: res => {
        return res['hydra:member'].map(p => ({
          label: p?.name?.toUpperCase(),
          value: p['@id'],
          siteId: p?.id,
          fuels: p?.fuels && p.fuels?.length > 0 ? p.fuels : [],
        }))
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewFuelSite: build.mutation({
      query: data => ({
        url: apiPath+`/fuel_sites`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editFuelSite: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/fuel_sites/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(fuelSiteApiService.util.updateQueryData('getUniqueFuelSite', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteFuelSite: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/fuel_sites/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          fuelSiteApiService.util.updateQueryData(
            'getFuelSitesList', args?.pages, draft => {
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
    
    searchFuelSupplyReportsResources: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/search_fuel_supply_resources',
        body: JSON.stringify(data),
      }),
    }),
    
    searchRefuelingResources: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/search_refueling_resources',
        body: JSON.stringify(data),
      }),
    }),
  
  })
})

export const {
  useGetFuelSitesListQuery,
  useGetUniqueFuelSiteQuery,
  useLazyGetPaginatedFuelSitesListQuery,
  useLazyGetSearchedFuelSitesListQuery,
  useLazyGetLoadFuelSitesQuery,
  
  useSearchFuelSupplyReportsResourcesMutation,
  useSearchRefuelingResourcesMutation,
  
  usePostNewFuelSiteMutation,
  useEditFuelSiteMutation,
  useDeleteFuelSiteMutation,
} = fuelSiteApiService
