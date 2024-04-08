import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";

export let nbUsersPages = 1

const userApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueUser: build.query({
      query: id => apiPath+`/users/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg,
      }]
    }),
    
    getUsersList: build.query({
      query: pages => apiPath+`/users?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbUsersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getPaginatedUsersList: build.query({
      query: ({page, pages}) => apiPath+`/users?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbUsersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedUsersList: build.query({
      query: keyword => apiPath+`/search_users/${keyword}`,
      transformResponse: res => {
        nbUsersPages = 1
        return res?.map(p => p)
      }
    }),
    
    
    // **************************************************************************
    
    
    postNewUser: build.mutation({
      query: data => ({
        headers: jsonLdHead,
        method: 'POST',
        url: apiPath+'/users',
        body: JSON.stringify({
          ...data,
          agentAccount: data?.agentAccount ? data.agentAccount?.value : null,
          roles: data?.role ? [data.role] : [],
        })
      })
    }),
    
    editUser: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/users/${data.id}`,
        body: JSON.stringify({
          ...data,
          agentAccount: data?.agentAccount ? data.agentAccount?.value : null,
          roles: data?.role ? [data.role] : null,
        })
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(userApiSlice.util.updateQueryData('getUniqueUser', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    editUserPassword: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/users/${data.id}/reset_password`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(userApiSlice.util.updateQueryData('getUniqueUser', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteUser: build.mutation({
      query: ({ id }) => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/users/${id}`,
        body: JSON.stringify({ isDeleted: true })
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(userApiSlice.util.updateQueryData('getUniqueUser', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    
    // **************************************************************************** STATS
    
    
    getCountUsers: build.query({
      query: () => apiPath+'/get_count_users',
    }),
    
    
    // **************************************************************************** END STATS
    
  })
})

export const {
  useGetCountUsersQuery,
  
  useGetUniqueUserQuery,
  useGetUsersListQuery,
  useLazyGetPaginatedUsersListQuery,
  useLazyGetSearchedUsersListQuery,
  
  usePostNewUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useEditUserPasswordMutation,
} = userApiSlice
