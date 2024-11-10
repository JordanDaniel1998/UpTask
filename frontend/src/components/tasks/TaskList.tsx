import { Task, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import DropTask from "./DropTask";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateStatusTask } from "@/services/TaskAPI";
import { useParams } from "react-router-dom";

type TaskListProps = {
  tasks: Task[];
  canRealizeActions: boolean;
};

type GroupedTasked = {
  // La llave tiene el tipo de dato string y el valor de la llave es un arreglo del tipo Task
  [key: string]: Task[];
};

const initialStatusGroupedTasks: GroupedTasked = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

const statusColors: { [key: string]: string } = {
  pending: "border-t-slate-500",
  onHold: "border-t-red-500",
  inProgress: "border-t-blue-500",
  underReview: "border-t-amber-500",
  completed: "border-t-emerald-500",
};

export default function TaskList({ tasks, canRealizeActions }: TaskListProps) {
  const groupedTasks = tasks.reduce((acc, task) => {
    // Obtenemos todos los objetos con un estado en específico
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    // Sacamos una copia del grupo y agregamos el objeto actual
    currentGroup = [...currentGroup, task];
    // Retorna todos los objetos de un grupo específico y sobreescribe el valor acumulado (initialStatusGroupedTasks)
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroupedTasks);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateStatusTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;
    // active:  Se guarda el id al arrastrar
    // over: Se guarda el id al soltar

    console.log(e);
    if (over && over.id) {
      mutate({
        projectId: projectId,
        taskId: active.id.toString(),
        status: over.id as TaskStatus,
      });

      // Actualizaciones optimistas
      queryClient.setQueryData(["project", projectId], (oldData: any) => {
        const updatedTasks = oldData.tasks.map((task: Task) => {
          if (task._id === active.id.toString()) {
            return { ...task, status: over.id as TaskStatus };
          }
          return task;
        });

        return {
          ...oldData,
          tasks: updatedTasks,
        };
      });
    }
  };

  return (
    <>
      <h2 className="text-5xl font-black">Tareas</h2>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-scroll 3xl:overflow-auto pb-10">
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 3xl:min-w-0 3xl:w-full">
              <h3
                className={`capitalize text-lg font-light border border-slate-300 bg-white p-3 border-t-8 ${statusColors[status]}`}
              >
                {statusTranslations[status]}
              </h3>
              <DropTask status={status} />
              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center">No Hay tareas</li>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      canRealizeActions={canRealizeActions}
                    />
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      </DndContext>
    </>
  );
}
