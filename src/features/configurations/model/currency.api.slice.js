import {api, apiPath, patchHead} from "../../../app/store";

const currencyApiSlice = api.injectEndpoints({
  endpoints: build => ({
    
    getUniqueCurrency: build.query({
      query: id => apiPath+`/currencies/${id}`,
      providesTags: (result, error, arg) => [{
        type: 'UNIQUE',
        id: arg
      }],
    }),
    
    editCurrency: build.mutation({
      query: data => ({
        method: 'PATCH',
        headers: patchHead,
        url: apiPath+`/currencies/${data.id}`,
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['LIST', { type: 'UNIQUE', id: (_, __, arg) => arg.id }]
    }),
    
  })
})

export const {
  useGetUniqueCurrencyQuery,
  useEditCurrencyMutation
} = currencyApiSlice
