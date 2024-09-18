import { Task } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";

type TaskListProps = {
  tasks: Task[];
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

export default function TaskList({ tasks }: TaskListProps) {
  const groupedTasks = tasks.reduce((acc, task) => {
    // Obtenemos todos los objetos con un estado en específico
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    // Sacamos una copia del grupo y agregamos el objeto actual
    currentGroup = [...currentGroup, task];
    // Retorna todos los objetos de un grupo específico y sobreescribe el valor acumulado (initialStatusGroupedTasks)
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroupedTasks);

  return (
    <>
      <h2 className="text-5xl font-black">Tareas</h2>
      <div className="flex gap-5 overflow-x-scroll 3xl:overflow-auto pb-32">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status} className="min-w-[300px] 3xl:min-w-0 3xl:w-full">
            <h3
              className={`capitalize text-lg font-light border border-slate-300 bg-white p-3 border-t-8 ${statusColors[status]}`}
            >
              {statusTranslations[status]}
            </h3>
            <ul className="mt-5 space-y-5">
              {tasks.length === 0 ? (
                <li className="text-gray-500 text-center">No Hay tareas</li>
              ) : (
                tasks.map((task) => <TaskCard key={task._id} task={task} />)
              )}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
