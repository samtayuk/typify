import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useToast } from "../toast/toastSlice";

import { useGetNextQuery, useUpdateMutation, useLazyGetNextQuery } from "./rawIngredientsSlice";
import { useLazyAutocompleteIngredientsQuery } from "./ingredientsSlice";

import { ClassifyItem } from "./ClassifyItem";

import { Header } from "../../ui/Header";
import { Modal } from "../../ui/Modal";
import { Card } from "../../ui/Card";

import { Autocomplete } from "../../ui/Autocomplete";

export const Classify = () => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden gap-2 md:gap-4 justify-start items-center pt-2 md:pt-2 px-1 md:px-72 bg-[url('/bg.jpg')] bg-bottom bg-cover">
      <h1 className="text-4xl py-1 md:py-2 md:text-3xl font-semibold font-['Dancing_Script'] text-slate-200">
        Typify
      </h1>

      <ClassifyItem number={1}/>
      <ClassifyItem number={2} />
      <ClassifyItem number={3} />
      <ClassifyItem number={4} />

      <a className="btn btn-primary right-5 bottom-5 absolute" href={`${import.meta.env.VITE_API_URL}/api/v1/file/export`} target="_blank">
        Export
      </a>
    </div>
  );
}
