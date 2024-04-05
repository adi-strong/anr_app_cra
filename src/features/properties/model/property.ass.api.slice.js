import {api, apiPath} from "../../../app/store";

const propertyAssApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    postNewPropertyAssignment: build.mutation({
      query: data => ({
        url: apiPath+`/property_assignments`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LIST'],
    }),
    
  })
})

export const {
  usePostNewPropertyAssignmentMutation,
} = propertyAssApiSlice
