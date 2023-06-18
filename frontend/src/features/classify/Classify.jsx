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

export const Classify = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { handleSubmit, control, formState: { errors }, reset, setValue, setFocus } = useForm();
  const [ nextTrigger, nextStatus ] = useLazyGetNextQuery();
  const [ acTrigger, acData ] = useLazyAutocompleteIngredientsQuery();
  const [ update, updateStatus ] = useUpdateMutation();

  let name = "";
  let id = null;

  useEffect(() => {
    if (nextStatus.isUninitialized && !nextStatus.isLoading) {
      nextTrigger();
    }
  }, [nextStatus.isUninitialized, nextStatus.isLoading]);

  useEffect(() => {
    if (nextStatus.isError) {
      toast("Error getting next ingredient");
    }

    if (nextStatus.isSuccess) {
      //acTrigger(nextStatus.data?.name);

      if (nextStatus.data?.confidence >= 60) {
        setValue("ingredientName", nextStatus.data?.suggestion);

        //console.log(nextStatus.data);
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
      toast("Ingredient added to database");
      nextTrigger();
      reset();
    }
  }, [updateStatus]);


  return (
    <div className="flex flex-col h-full w-full overflow-hidden gap-2 md:gap-10 justify-start items-center pt-2 md:pt-20 px-3 md:px-72 bg-[url('/bg.jpg')] bg-bottom bg-cover">
      <h1 className="text-4xl py-1 md:py-4 md:text-8xl font-semibold font-['Dancing_Script'] text-slate-200">
        Typify
      </h1>
      <div className=" bg-neutral-700 p-10 rounded-lg w-full">
        <h1 className="text-2xl md:text-4xl text-white mb-3 text-center font-['Tsukimi_Rounded']">
          {nextStatus.isLoading || nextStatus.isFetching || !nextStatus.isSuccess ? "Loading..." : nextStatus.data?.name}
        </h1>
        <form onSubmit={(e) => e.preventDefault()}>

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

        </form>
      </div>
      <a className="btn btn-primary right-5 bottom-5 absolute" href={`${import.meta.env.VITE_API_URL}/api/v1/file/export`} target="_blank">
        Export
      </a>
    </div>
  );
}
