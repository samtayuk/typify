import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useToast } from "../toast/toastSlice";

import { useGetNextQuery, useUpdateMutation, useLazyGetNextQuery } from "./rawIngredientsSlice";
import { useLazyAutocompleteIngredientsQuery } from "./ingredientsSlice";

import { Header } from "../../ui/Header";
import { Modal } from "../../ui/Modal";
import { Card } from "../../ui/Card";

import { Autocomplete } from "../../ui/Autocomplete";

export const ClassifyItem = ({ number }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { handleSubmit, control, formState: { errors }, reset, setValue, setFocus } = useForm();
  const [ nextTrigger, nextStatus ] = useLazyGetNextQuery();
  const [ acTrigger, acData ] = useLazyAutocompleteIngredientsQuery();
  const [ update, updateStatus ] = useUpdateMutation();

  let name = "";
  let id = null;

  const getNextItem = () => {
    nextTrigger({ number: number });
  };

  useEffect(() => {
    if (nextStatus.isUninitialized && !nextStatus.isLoading) {
      getNextItem();
    }
  }, [nextStatus.isUninitialized, nextStatus.isLoading]);

  useEffect(() => {
    if (nextStatus.isError) {
      toast("Error getting next ingredient");
    }

    if (nextStatus.isSuccess) {
      acTrigger(nextStatus.data?.name);

      if (nextStatus.data?.confidence >= 60) {
        setValue("ingredientName", nextStatus.data?.suggestion);
        acTrigger(nextStatus.data?.suggestion);


        //console.log(nextStatus.data);
      } else {
        acTrigger(nextStatus.data?.name);
      }


    }
  }
  , [nextStatus.isError, nextStatus.data, nextStatus.data?.name, nextStatus.data?.id]);

  useEffect(() => {
    if (acData.data === undefined) {
      acData.data = []
    }
  }, [acData]);

  useEffect(() => {
    if (updateStatus.isSuccess) {
      //toast("Ingredient added to database");
      getNextItem();
      reset();
    }
  }, [updateStatus]);


  return (
    <div className=" bg-neutral-700 p-4 rounded-lg w-full">
      <h1 className="text-lg md:text-4xl text-white mb-3 text-center font-['Tsukimi_Rounded']">
        {nextStatus.isLoading || nextStatus.isFetching || !nextStatus.isSuccess ? "Loading..." : nextStatus.data?.name}
      </h1>
      <form onSubmit={(e) => e.preventDefault()}>

        <div className="join w-full">
            <Controller
              control={control}
              name="ingredientName"
              render={({ field }) => (
                <Autocomplete
                  items={acData.isLoading || !acData.isSuccess || acData.isFetching ? [] : acData.data}
                  value={field.value}
                  onItemSelect={(value) => {
                    setValue(field.name, value.name);
                    handleSubmit((d) => {
                      update({id: nextStatus.data?.id, ingredientName: d.ingredientName.toLowerCase()})
                      setValue(field.name, "");
                    })();
                  }}
                  onChange={(value) => {
                    field.onChange(value);
                    acTrigger(value);
                  }}
                  displayValue={(v) => v.name}
                />
              )}
            />
            <button className="btn join-item" disabled={nextStatus.data?.confidence < 60} onClick={() => {
              handleSubmit((d) => {
                update({id: nextStatus.data?.id, ingredientName: d.ingredientName.toLowerCase()})
                setValue("ingredientName", "");
              })()}}>
                Yes
              </button>
          </div>
      </form>
    </div>
  );
}
