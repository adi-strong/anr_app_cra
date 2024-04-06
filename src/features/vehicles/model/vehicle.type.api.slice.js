import {api, apiPath, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbVehicleTypesPages = 1

const vehicleTypeApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getVehicleTypesList: build.query({
      query: pages => apiPath+`/vehicle_types?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbVehicleTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniqueVehicleType: build.query({
      query: id => apiPath+`/vehicle_types/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedVehicleTypesList: build.query({
      query: ({page, pages}) => apiPath+`/vehicle_types?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbVehicleTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedVehicleTypesList: build.query({
      query: keyword => apiPath+`/vehicle_types?name=${keyword}`,
      transformResponse: res => {
        nbVehicleTypesPages = 1
        return res['hydra:member']?.map(p => p)
      }
    }),
    
    getLoadVehicleTypes: build.query({
      query: name => apiPath+`/vehicle_types?name=${name}`,
      providesTags: result => result,
      transformResponse: res => {
        return res['hydra:member']?.map(p => ({
          label: p?.name?.toUpperCase(),
          value: `/api/vehicle_types/${p.id}`,
        }))
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewTypeVehicle: build.mutation({
      query: data => ({
        url: apiPath+`/vehicle_types`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editVehicleType: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/vehicle_types/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(vehicleTypeApiSlice.util.updateQueryData('getUniqueVehicleType', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteVehicleType: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/vehicle_types/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          vehicleTypeApiSlice.util.updateQueryData(
            'getVehicleTypesList', args?.pages, draft => {
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
  useGetVehicleTypesListQuery,
  useGetUniqueVehicleTypeQuery,
  useLazyGetPaginatedVehicleTypesListQuery,
  useLazyGetSearchedVehicleTypesListQuery,
  useLazyGetLoadVehicleTypesQuery,
  
  usePostNewVehicleTypeMutation,
  useEditVehicleTypeMutation,
  useDeleteVehicleTypeMutation,
} = vehicleTypeApiSlice
