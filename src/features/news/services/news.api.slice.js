import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbNewsPages = 1

const newsApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueNews: build.query({
      query: id => apiPath+`/news/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getNewsList: build.query({
      query: pages => apiPath+`/news?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbNewsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getPaginatedNewsList: build.query({
      query: ({page, pages}) => apiPath+`/news?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbNewsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedNewsList: build.query({
      query: title => apiPath+`/news?title=${title}`,
      transformResponse: res => {
        nbNewsPages = 1
        return res['hydra:member']?.map(p => p)
      }
    }),
    
    getSearchDailyNews: build.query({
      query: (): void => apiPath+`/daily_news`,
      transformResponse: res => {
        nbNewsPages = 1
        return res
      }
    }),
    
    getSearchNewsResource: build.mutation({
      query: data => ({
        headers: jsonLdHead,
        url: apiPath+`/search_news_resources`,
        method: 'POST',
        body: JSON.stringify(data),
      }),
    }),
    
    
    // ****************************************************************************
    
    
    createNews: build.mutation({
      query: data => ({
        url: apiPath+`/news`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editNews: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/news/${data.id}`,
        body: JSON.stringify({
          ...data,
          department: data?.department ? data.department?.value : null
        })
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(newsApiSlice.util.updateQueryData('getUniqueNews', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    editNewsAssignment: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/news/${data.id}`,
        body: JSON.stringify({ department: data?.department ? data.department?.value : null })
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(newsApiSlice.util.updateQueryData('getUniqueNews', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteNews: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/news/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          newsApiSlice.util.updateQueryData(
            'getNewsList', args?.pages, draft => {
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
  useGetUniqueNewsQuery,
  useGetNewsListQuery,
  useGetSearchDailyNewsQuery,
  
  useLazyGetPaginatedNewsListQuery,
  useLazyGetSearchedNewsListQuery,
  
  useCreateNewsMutation,
  useEditNewsMutation,
  useDeleteNewsMutation,
  useGetSearchNewsResourceMutation,
  useEditNewsAssignmentMutation,
} = newsApiSlice
