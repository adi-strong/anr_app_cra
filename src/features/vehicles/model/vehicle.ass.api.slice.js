import {api, apiPath} from "../../../app/store";

const vehicleAssApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    postNewVehicleAssignment: build.mutation({
      query: data => ({
        url: apiPath+`/vehicle_assignments`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
  
  })
})

export const {
  usePostNewVehicleAssignmentMutation
} = vehicleAssApiSlice
