import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { CheckIcon, ArrowPathIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { useToast } from "../toast/toastSlice";

import { useUpdateMutation, useLazyGetNextQuery } from "./rawIngredientsSlice";
import { useLazyAutocompleteIngredientsQuery } from "./ingredientsSlice";

import { Autocomplete } from "../../ui/Autocomplete";

export const ClassifyItem = ({ number, predictOnly=true }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { handleSubmit, control, formState: { errors }, reset, setValue, setFocus } = useForm();
  const [ nextTrigger, nextStatus ] = useLazyGetNextQuery();
  const [ acTrigger, acData ] = useLazyAutocompleteIngredientsQuery();
  const [ update, updateStatus ] = useUpdateMutation();

  let name = "";
  let id = null;

  const getNextItem = () => {
    setValue("ingredientName", "");
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
        if (predictOnly) {
          getNextItem();
        } else {
          acTrigger(nextStatus.data?.name);
        }
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
      <h1 className="text-lg md:text-4xl text-white mb-4 text-center font-['Tsukimi_Rounded'] truncate">
        {nextStatus.isLoading || nextStatus.isFetching || !nextStatus.isSuccess ? "Loading..." : nextStatus.data?.name}
      </h1>
      <form onSubmit={(e) => e.preventDefault()}>

        <div className="join w-full">
            <button className="btn join-item" onClick={() => { getNextItem() }} disabled={nextStatus.isLoading || nextStatus.isFetching || !nextStatus.isSuccess}>
              <NoSymbolIcon className="w-5 h-5" />
            </button>
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
            <button className="btn btn-secondary join-item" disabled={((nextStatus.data?.confidence < 60) || nextStatus.isLoading || nextStatus.isFetching || !nextStatus.isSuccess)} onClick={() => {
              handleSubmit((d) => {
                update({id: nextStatus.data?.id, ingredientName: d.ingredientName.toLowerCase()})
                setValue("ingredientName", "");
              })()}}>
                <CheckIcon className="w-5 h-5" />
              </button>
          </div>
      </form>
    </div>
  );
}
