import { NoteForm } from "@/types/index";
import { useForm } from "react-hook-form";
import AlertMessage from "../AlertMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createNote } from "@/services/NoteApi";
import { useParams } from "react-router-dom";

export default function AddNoteForm() {
  const params = useParams();
  const projectId = params.projectId!;

  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;

  const initialValues: NoteForm = {
    content: "",
  };

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["view-task", taskId] });
      reset();
    },
  });

  const handleAddNote = (formData: NoteForm) => {
    mutate({
      formData,
      projectId,
      taskId,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleAddNote)}
        className="space-y-3"
        noValidate
      >
        <div className="mb-5 space-y-3">
          <label htmlFor="content" className="text-sm uppercase font-bold">
            Nota
          </label>
          <textarea
            id="content"
            className="w-full p-3  border border-gray-200"
            placeholder="Nota de la tarea"
            {...register("content", {
              required: "La nota de la tarea es obligatoria",
            })}
          />

          {errors.content && (
            <AlertMessage>{errors.content.message}</AlertMessage>
          )}
        </div>

        <input
          type="submit"
          value="Crear Nota"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full text-white uppercase p-3 font-bold cursor-pointer transition-colors"
        />
      </form>
    </>
  );
}
