import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { Controller } from "react-hook-form";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import { useToast } from "../toast/toastSlice";
import { FormInput } from "../../ui/Input";
import { Autocomplete } from '../../ui/Autocomplete';
import { Header } from '../../ui/Header';
import { useLazyGetMealQuery, useCreateMealMutation, useUpdateMealMutation } from "./mealsSlice";


const IngredientAutocomplete = ({ index, control, setValue }) => {
  const [trigger, { data = [] }] = useLazyAutocompleteIngredientsQuery();

  return (
    <div className="flex">
      <Controller
        control={control}
        name={`ingredients.${index}.quantity`}
        render={({ field }) => (
          <input
            type="number"
            className="input input-bordered mr-1 w-20"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />

      <Controller
        control={control}
        name={`ingredients.${index}.unit`}
        render={({ field }) => (
          <select
            className="select select-bordered mr-1"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          >
            <option>each</option>
            <option>ml</option>
            <option>grams</option>
          </select>
        )}
      />

      <Controller
        control={control}
        name={`ingredients.${index}.name`}
        render={({ field }) => (
          <Autocomplete
            items={data}
            value={field.value}
            onItemSelect={(value) => {
              setValue(`ingredients.${index}.name`, value.name);
              setValue(`ingredients.${index}.unit`, value.unit);
            }}
            onChange={(value) => {
              field.onChange(value);
              trigger(value);
            }}
            displayValue={(value) => {
              return value.name;
            }}
          />
        )}
      />
    </div>
  );
};


export const MealCreateUpdate = () => {
  const { id } = useParams();
  const [getMeal, { data={}, isSuccess, isLoading, isError } ] = useLazyGetMealQuery();
  const navigate = useNavigate();
  const toast = useToast();
  const [ create, createStatus ] = useCreateMealMutation();
  const [ update, updateStatus ] = useUpdateMealMutation();
  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm();
  const ingredientsFieldArray = useFieldArray({
    control,
    name: "ingredients",
  });

  const instructionsFieldArray = useFieldArray({
    control,
    name: "instructions",
  });

  useEffect(() => {
    if (createStatus.isSuccess) {
      // TODO: Show success message
      toast("Meal created successfully!", { type: "success" });
      navigate(`/meals/${createStatus.data.id}`);
    }

    if (createStatus.isError) {
      // TODO: Show error message
      toast(`Error creating meal!`, { type: "error" });
      console.error("Error creating recipe: ", createStatus.error);
    }

    if (updateStatus.isSuccess) {
      // TODO: Show success message
      toast(`Meal updated successfully!`, { type: "success" });
      navigate(`/meals/${updateStatus.data.id}`);
    }

    if (updateStatus.isError) {
      // TODO: Show error message
      toast("Error updating Meal!", { type: "error" });
      console.error("Error updating recipe: ", updateStatus.error);
    }
  }, [createStatus, navigate, updateStatus]);

  useEffect(() => {
    if (id && !isSuccess && !isLoading && !isError) {
      getMeal(id);
    }

    if (id && isError) {
      console.error("Error getting meal: ", data);
      // TODO: Show error message 404?
    }

    if (isSuccess) {
      reset(data);
    }

  }, [id, getMeal, isSuccess, reset, isLoading, isError, data]);

  const onSubmit = (data) => {
    // TODO: Add validation

    if (id) {
      update({ mealDetails: data, id });
    } else {
      create({ mealDetails: data });
    }
  };

  if (id && !isSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full overflow-y-scroll">
      <Header title={`Meal ${ id ? "Update" : "Create"}`} />

      <form className="flex flex-col h-full w-full px-3 overflow-y-scroll" onSubmit={handleSubmit(onSubmit)}>

        <FormInput
          label="Title"
          errors={errors}
          {...register("title")}
          className="w-full"
        />
        <FormInput
          label="Servings"
          className=""
          errors={errors}
          {...register("servings")}
        />
        <FormInput
          label="Recipe URL"
          className=""
          errors={errors}
          {...register("recipeUrl")}
        />

        <div className="form-control">
          <label className="label">
            <span className="label-text">Notes</span>
          </label>
          <textarea className="textarea textarea-bordered" {...register("notes")}></textarea>
        </div>

        <h2 className="text-center w-full uppercase text-lg mt-3 mb-3 border-b pb-2">
          Ingredients
        </h2>

        {ingredientsFieldArray.fields.map((field, index) => (
          <div className="mb-1 flex flex-wrap justify-center rounded-md gap-1 bg-base-300 p-2">
            <div className="form-control mb-1">
              <div className="input-group">
                <input type="text" className="input input-bordered w-20" {...register(`ingredients.${index}.quantity`)} />
                <select className="select select-bordered" {...register(`ingredients.${index}.unit`)}>
                  <option>each</option>
                  <option>ml</option>
                  <option>grams</option>
                </select>
              </div>
            </div>
            <input type="text" className="input input-bordered" {...register(`ingredients.${index}.name`)} />
          </div>
        ))}

        <button
          type="button"
          className="btn mb-1"
          onClick={() =>
            ingredientsFieldArray.append({
              name: "",
              quantity: 0,
              unit: "each",
            })
          }
        >
          <PlusIcon className="h-6 w-6" />
        </button>



        <button className="btn btn-primary mb-1" type="submit">
          {(createStatus.isLoading || updateStatus.isLoading) && (
            <span className="animate-spin">
              <MinusIcon className="h-6 w-6" />
            </span>
          )}
          {id ? "Update" : "Create"}
        </button>

      </form>
    </div>
  );
};