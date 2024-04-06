import {api, apiPath, jsonLdHead, patchHead} from "../../../app/store";
import toast from "react-hot-toast";

export let nbFolderTypesPages = 1

export const folderTypeActionItems = [
  // {title: 'Voir', event: 'show'},
  {title: 'Modifier', event: 'edit'},
  {title: 'Supprimer', event: 'delete', className: 'text-danger'},
]

export const onFolderTypeActionsFilter = (event, data, navigate, toggleShow, toggleOpen): void => {
  switch (event) {
    case 'edit':
      // navigate(`/app/agents/${data.id}/edit`)
      toggleShow()
      break
    case 'delete':
      toggleOpen()
      break
    default:
      // navigate(`/app/agents/${data.id}/show`)
      break
  }
}

const folderTypeApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getFolderTypesList: build.query({
      query: pages => apiPath+`/folder_types?itemsPerPage=${pages}`,
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'LIST', id }))]
        : ['LIST'],
      transformResponse: res => {
        nbFolderTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getUniqueFolderType: build.query({
      query: id => apiPath+`/folder_types/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    getPaginatedFolderTypesList: build.query({
      query: ({page, pages}) => apiPath+`/folder_types?page=${page}&itemsPerPage=${pages}`,
      transformResponse: res => {
        nbFolderTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return res['hydra:member'].map(p => p)
      }
    }),
    
    getSearchedFolderTypesList: build.query({
      query: name => apiPath+`/folder_types?name=${name}`,
      transformResponse: res => {
        nbFolderTypesPages = 1
        return res['hydra:member']?.map(p => p)
      }
    }),
    
    getLoadFolderTypes: build.query({
      query: name => apiPath+`/folder_types?name=${name}`,
      providesTags: result => result,
      transformResponse: res => {
        return res['hydra:member']?.map(p => ({
          label: p?.name,
          value: p['@id'],
        }))
      }
    }),
    
    
    // ****************************************************************************
    
    
    postNewFolderType: build.mutation({
      query: data => ({
        url: apiPath+`/folder_types`,
        headers: jsonLdHead,
        method: 'POST',
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
    }),
    
    editFolderType: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/folder_types/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        try {
          const { data: patchResult } = await queryFulfilled
          
          dispatch(folderTypeApiSlice.util.updateQueryData('getUniqueFolderType', args?.id?.toString(), draft => {
            Object.assign(draft, {...patchResult})
          }))
        }
        catch (e) { }
      }
    }),
    
    deleteFolderType: build.mutation({
      query: ({ id }) => ({
        headers: patchHead,
        method: 'PATCH',
        url: apiPath+`/folder_types/${id}`,
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['LIST'],
      async onQueryStarted(args, {
        dispatch,
        queryFulfilled}) {
        const patchResult = dispatch(
          folderTypeApiSlice.util.updateQueryData(
            'getFolderTypesList', args?.pages, draft => {
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
  useGetFolderTypesListQuery,
  useGetUniqueFolderTypeQuery,
  useLazyGetPaginatedFolderTypesListQuery,
  useLazyGetSearchedFolderTypesListQuery,
  useLazyGetLoadFolderTypesQuery,
  
  usePostNewFolderTypeMutation,
  useEditFolderTypeMutation,
  useDeleteFolderTypeMutation,
} = folderTypeApiSlice
