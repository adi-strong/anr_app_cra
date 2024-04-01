import {api, apiPath, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbVehiclesPages = 1

const vehicleApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getVehiclesList: build.query({
      query: pages => apiPath+`/vehicles?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbVehiclesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniqueVehicle: build.query({
      query: id => apiPath+`/vehicles/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedVehiclesList: build.query({
      query: ({page, pages}) => apiPath+`/vehicles?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbVehiclesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedVehiclesList: build.query({
      query: keyword => apiPath+`/vehicles?brand=${keyword}`,
      transformResponse: res => {
        nbVehiclesPages = 1
        return res['hydra:member']?.map(p => p)
      }
    }),
    
    getLoadVehicles: build.query({
      query: name => apiPath+`/vehicles?brand=${name}`,
      providesTags: result => result,
      transformResponse: res => {
        return res?.map(p => ({
          label: p?.name?.toUpperCase()+' '+(p?.firstName ? p.firstName.toUpperCase()+' ' : ''),
          value: `/api/vehicles/${p.id}`,
        }))
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewVehicle: build.mutation({
      query: data => ({
        url: apiPath+`/vehicles`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editVehicle: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/vehicles/${data.id}`,
        body: JSON.stringify({...data, type: data?.type ? data.type?.value : null})
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(vehicleApiSlice.util.updateQueryData('getUniqueVehicle', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteVehicle: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/vehicles/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          vehicleApiSlice.util.updateQueryData(
            'getVehiclesList', args?.pages, draft => {
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
  useGetVehiclesListQuery,
  useGetUniqueVehicleQuery,
  useLazyGetPaginatedVehiclesListQuery,
  useLazyGetSearchedVehiclesListQuery,
  useLazyGetLoadVehiclesQuery,
  
  usePostNewVehicleMutation,
  useEditVehicleMutation,
  useDeleteVehicleMutation,
} = vehicleApiSlice
