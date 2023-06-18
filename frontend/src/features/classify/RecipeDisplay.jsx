import React from "react";
import { useParams, Link } from "react-router-dom";

import { useGetRecipeQuery } from "./recipesSlice";
import { NavButton } from "../../ui/NavButton";

export const RecipeDisplay = () => {
  const { id } = useParams();
  const { data, isFetching } = useGetRecipeQuery(id);

  return (
    <div>
      <NavButton to="/recipes">Back</NavButton>
      <NavButton to={`/recipes/${id}/edit`}>Edit</NavButton>

      {isFetching ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-6xl m-5">{data.title}</h2>
          <div className="flex justify-center m-5 mb-10 text-m">
            <div className="border-l border-r pl-4 pr-4">
              <h4 className="uppercase">Prep Time</h4>
              <span className="">{data.prepTime}</span>
            </div>

            <div className="border-r pr-4 pl-4">
              <h4 className="uppercase">Cook Time</h4>
              <span className="">{data.cookTime}</span>
            </div>

            <div className="border-r pl-4 pr-4">
              <h4 className="uppercase">Servings</h4>
              <span className="">{data.servings}</span>
            </div>
          </div>

          <div className="flex w-[900px]">
            <div className="w-1/3 border-r pr-3">
              <h3 className="text-center uppercase text-lg mb-3 border-b pb-2">
                Ingredients
              </h3>
              <ul className="text-left">
                {data.ingredients.map((ingredient, key) => (
                  <li className="pb-2" key={key}>
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-2/3 pl-3">
              <h3 className="text-center uppercase text-lg mb-3 border-b pb-2">
                Instructions
              </h3>
              <ol className="ml-10 mr-5 text-left list-decimal">
                {data.instructions.map((step, key) => (
                  <li className="border-b p-5" key={key}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
