import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const ingredientsSlice = createApi({
  reducerPath: "ingredientsSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/ingredients`,
  }),
  tagTypes: ["Ingredient", "AutocompleteIngredient"],
  endpoints: (builder) => ({
    autocompleteIngredients: builder.query({
      query: (ingredient) => ({
        url: "/autocomplete",
        params: {
          ingredient,
        },
      }),

      invalidatesTags: [{ type: "AutocompleteIngredient", id: "LIST" }],
      providesTags: [{ type: "AutocompleteIngredient", id: "LIST" }],
    }),
  }),
});

export const { useAutocompleteIngredientsQuery, useLazyAutocompleteIngredientsQuery } =
  ingredientsSlice;
