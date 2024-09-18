import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TaskForm from "./TaskForm";
import { TaskFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createTask } from "@/services/TaskAPI";

export default function AddTaskModal() {
  const navigate = useNavigate();
  // Recuperas información de la URL, brinda información de las QueryString, ruta, payload, etc.
  const location = useLocation();
  // Busca los parámetros de una URL, esto es aplicable si la cadena tiene la forma de un QueryString (?newTask=true | ?newTask=true&test=4)
  const queryParams = new URLSearchParams(location.search);
  // Obtenemos el valor de los parámetros
  const modalTask = queryParams.get("newTask");
  const showModal = modalTask ? true : false;

  // Permite obtener aquellos parámetros que son variables en la ruta
  const params = useParams();
  const projectId = params.projectId!;

  const initialValues: TaskFormData = {
    name: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      navigate(location.pathname, { replace: true });
      reset();
    },
  });

  const handleSubmitForm = (data: TaskFormData) => {
    const task = {
      data: data,
      projectId: projectId,
    };
    mutate(task);
  };

  return (
    <>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            // location.pathname -> Obtiene la ruta actual | replace: true -> Elimina el QueryString de la ruta
            navigate(location.pathname, { replace: true });
          }}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-8 sm:p-10 lg:p-16 flex flex-col gap-10">
                  <div className="flex flex-col gap-3">
                    <DialogTitle as="h3" className="font-black text-4xl">
                      Nueva Tarea
                    </DialogTitle>

                    <p className="text-xl font-bold">
                      Llena el formulario y crea {""}
                      <span className="text-fuchsia-600">una tarea</span>
                    </p>
                  </div>

                  <div>
                    <form
                      className="space-y-3 flex flex-col gap-10"
                      onSubmit={handleSubmit(handleSubmitForm)}
                      noValidate
                    >
                      <TaskForm register={register} errors={errors} />
                      <input
                        type="submit"
                        value="Guardar Tarea"
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full text-white uppercase p-3 font-bold cursor-pointer transition-colors"
                      />
                    </form>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
