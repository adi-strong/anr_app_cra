import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbDepartmentsPages = 1

const departmentApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getDepartmentsList: build.query({
      query: pages => apiPath+`/departments?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbDepartmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getPaginatedDepartmentsList: build.query({
      query: ({page, pages}) => apiPath+`/departments?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbDepartmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedDepartmentsList: build.query({
      query: name => apiPath+`/search_departments/${name}`,
      transformResponse: res => {
        nbDepartmentsPages = 1
        return res?.map(p => p)
      }
    }),
    
    getUniqueDepartment: build.query({
      query: id => apiPath+`/departments/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getLoadDepartments: build.query({
      query: name => apiPath+`/departments?name=${name}`,
      providesTags: result => result,
      transformResponse: res => {
        return res['hydra:member'].map(p => ({
          label: p?.name?.toUpperCase(),
          value: p['@id'],
          grades: p?.grades && p.grades.length > 0 ? p.grades : [],
          departmentServices: p?.departmentServices && p.departmentServices.length > 0 ? p.departmentServices : [],
        }))
      }
    }),
    
    
    // ****************************************************************************
    
    getServicesList: build.query({
      query: pages => apiPath+`/department_services?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        // nbDepartmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getLoadServices: build.query({
      query: name => apiPath+`/department_services?name=${name}`,
      providesTags: result => result,
      transformResponse: res => {
        return res['hydra:member'].map(p => ({
          label: p?.name?.toUpperCase(),
          value: p['@id'],
        }))
      }
    }),
    
    
    // ****************************************************************************
    
    
    editDepartment: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/departments/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(departmentApiSlice.util.updateQueryData('getUniqueDepartment', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    addDepartment: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/departments',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
    
    deleteDepartment: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/departments/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          departmentApiSlice.util.updateQueryData(
            'getDepartmentsList', args?.pages, draft => {
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
    
    
    // Services
    // ****************************************************************************
    
    addService: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/department_services',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          dispatch(departmentApiSlice.util.updateQueryData('getUniqueDepartment', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    editService: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/department_services/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(departmentApiSlice.util.updateQueryData('getUniqueDepartment', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteService: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/department_services/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        queryFulfilled}) {
        
        try {
          await queryFulfilled
          toast.success('Suppression bien efféctuée.')
        }
        catch (e) { }
      }
    }),
    
    getUniqueService: build.query({
      query: id => apiPath+`/department_services/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    // End Services
    
    
    // Grades
    // ****************************************************************************
    
    addGrade: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/grades',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          dispatch(departmentApiSlice.util.updateQueryData('getUniqueDepartment', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    editGrade: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/grades/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(departmentApiSlice.util.updateQueryData('getUniqueDepartment', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteGrade: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/grades/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        queryFulfilled}) {
        
        try {
          await queryFulfilled
          toast.success('Suppression bien efféctuée.')
        }
        catch (e) { }
      }
    }),
    
    getUniqueGrade: build.query({
      query: id => apiPath+`/grades/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    // End Grades
    
    
    // Grades
    // ****************************************************************************
    
    addJob: build.mutation({
      query: data => ({
        method: 'POST',
        headers: jsonLdHead,
        url: apiPath+'/grades',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          dispatch(departmentApiSlice.util.updateQueryData('getUniqueDepartment', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    editJob: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/grades/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(departmentApiSlice.util.updateQueryData('getUniqueDepartment', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteJob: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/grades/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        queryFulfilled}) {
        
        try {
          await queryFulfilled
          toast.success('Suppression bien efféctuée.')
        }
        catch (e) { }
      }
    }),
    
    getUniqueJob: build.query({
      query: id => apiPath+`/grades/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    // End Grades
  
  })
})

export const {
  useGetDepartmentsListQuery,
  useLazyGetPaginatedDepartmentsListQuery,
  useLazyGetSearchedDepartmentsListQuery,
  useGetUniqueDepartmentQuery,
  useGetUniqueGradeQuery,
  useGetUniqueServiceQuery,
  useGetUniqueJobQuery,
  useLazyGetLoadDepartmentsQuery,
  
  useGetServicesListQuery,
  useLazyGetLoadServicesQuery,
  
  useEditDepartmentMutation,
  useAddDepartmentMutation,
  useDeleteDepartmentMutation,
  useAddServiceMutation,
  useEditServiceMutation,
  useDeleteServiceMutation,
  useAddGradeMutation,
  useEditGradeMutation,
  useDeleteGradeMutation,
  useAddJobMutation,
  useEditJobMutation,
  useDeleteJobMutation,
  useGetUniqueJobMutation,
} = departmentApiSlice
