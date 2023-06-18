import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const rawIngredientsSlice = createApi({
  reducerPath: "rawIngredientsSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/raw-ingredients`,
  }),
  tagTypes: ["Raw Ingredient"],
  endpoints: (builder) => ({
    getNext: builder.query({
      query: () => "/next",
      providesTags: (result) => [{ type: "Raw Ingredient", id: result.id }],
    }),

    update: builder.mutation({
      query: ({ id, ingredientName }) => ({
        url: `/${id}/update`,
        method: "PUT",
        body: { ingredientName: ingredientName },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Raw Ingredient", id: result.id },
      ],
    }),
  }),
});

export const {
  useGetNextQuery,
  useLazyGetNextQuery,
  useUpdateMutation,
} = rawIngredientsSlice;
