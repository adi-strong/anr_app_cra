import {api, apiPath} from "../../../app/store";

const newsTreatmentApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getDepartmentNews: build.query({
      query: (): void => apiPath+`/department_news`,
      providesTags: ['LIST'],
      transformResponse: res => {
        return res?.map(p => p)
      }
    }),
    
  })
})

export const {
  useGetDepartmentNewsQuery,
} = newsTreatmentApiSlice
