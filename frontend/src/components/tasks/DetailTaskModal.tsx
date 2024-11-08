import { Fragment, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskById, updateStatusTask } from "@/services/TaskAPI";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/index";
import { statusTranslations } from "@/locales/es";
import { TaskStatus } from "@/types/index";

export default function DetailTaskModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;

  const params = useParams();
  const projectId = params.projectId!;

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["view-task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    retry: false,
    enabled: !!taskId,
  });

  // Mostrar el modal cuando ya existen datos y ya terminó de cargar
  const showModal = !isLoading && !isError && !!taskId && !!data;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateStatusTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["view-task", taskId] });
      /* navigate(location.pathname, { replace: true }); */
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const task = {
      projectId: projectId,
      taskId: taskId,
      status: e.target.value as TaskStatus,
    };

    mutate(task);
  };

  // En el primer render no funciona -> Arreglar
  useEffect(() => {
    if (!isLoading && isError) {
      toast.error(error.message, { toastId: "error" });
      navigate(location.pathname, { replace: true });
    }
  }, [isError, isLoading, error?.message]);

  return (
    <>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
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
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-8 sm:p-10 lg:p-16 flex flex-col gap-2">
                  <p className="text-sm text-slate-400">
                    Agregado el: {formatDate(data?.createdAt)}
                  </p>
                  <p className="text-sm text-slate-400">
                    Última actualización: {formatDate(data?.updatedAt)}
                  </p>
                  <DialogTitle
                    as="h3"
                    className="font-black text-4xl text-slate-600 my-5"
                  >
                    {data?.name}
                  </DialogTitle>
                  <p className="text-lg text-slate-500 mb-2">
                    Descripción: {data?.description}
                  </p>
                  {data?.completedBy && (
                    <ul className="bg-fuchsia-100 p-4 rounded-md list-decimal">
                      <p className="text-2xl text-slate-500 mb-2">
                        Historial de cambios
                      </p>
                      {data.completedBy.map((item) => (
                        <li
                          key={item._id}
                          className="font-normal text-slate-600 ml-5 md:ml-8 whitespace-normal"
                        >
                          <span className="font-bold">
                            {statusTranslations[item.status]}
                          </span>{" "}
                          por:{" "}
                          <span className="font-bold">{item.user.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 space-y-3">
                    <label className="font-bold" htmlFor="status">
                      Estado Actual
                    </label>
                    <select
                      name="status"
                      id="status"
                      className="w-full p-3 bg-white border border-gray-300"
                      defaultValue={data?.status}
                      onChange={handleChange}
                    >
                      {Object.entries(statusTranslations).map(
                        ([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        )
                      )}
                    </select>
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
