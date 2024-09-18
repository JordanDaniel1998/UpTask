import Spinner from "@/components/spinners/Spinner";
import TaskList from "@/components/tasks/TaskList";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import { getProjectById } from "@/services/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import EditTaskData from "@/components/tasks/EditTaskData";
import DetailTaskModal from "@/components/tasks/DetailTaskModal";

export default function DetailProjectPage() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  });

  if (isError) return <Navigate to="/404" />;

  return (
    <>
      <section className="flex flex-col gap-10 w-full mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl fonr-black">{data.projectName}</h1>
              <p className="text-2xl font-light text-gray-500">
                {data.description}
              </p>

              <div>
                <button
                  type="button"
                  className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                  onClick={() => navigate(location.pathname + `?newTask=true`)}
                >
                  Agregar Tarea
                </button>
              </div>
            </div>

            <TaskList tasks={data.tasks} />

            <AddTaskModal />
            <EditTaskData />
            <DetailTaskModal />
          </>
        )}
      </section>
    </>
  );
}
