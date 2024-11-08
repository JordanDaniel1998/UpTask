import { FieldErrors, UseFormRegister } from "react-hook-form";
import { TaskFormData } from "@/types/index";
import AlertMessage from "../AlertMessage";

type TaskFormProps = {
  errors: FieldErrors<TaskFormData>;
  register: UseFormRegister<TaskFormData>;
};

export default function TaskForm({ errors, register }: TaskFormProps) {
  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <label className="font-normal text-2xl" htmlFor="name">
            Nombre de la tarea
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nombre de la tarea"
            className="w-full p-3  border-gray-300 border"
            {...register("name", {
              required: "El nombre de la tarea es obligatorio",
            })}
          />
          {errors.name && <AlertMessage>{errors.name.message}</AlertMessage>}
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-normal text-2xl" htmlFor="description">
            Descripción de la tarea
          </label>
          <textarea
            id="description"
            placeholder="Descripción de la tarea"
            className="w-full p-3 border-gray-300 border"
            {...register("description", {
              required: "La descripción de la tarea es obligatoria",
            })}
          />
          {errors.description && (
            <AlertMessage>{errors.description.message}</AlertMessage>
          )}
        </div>
      </div>
    </>
  );
}
