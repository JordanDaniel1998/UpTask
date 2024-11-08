import Spinner from "@/components/spinners/Spinner";
import TaskList from "@/components/tasks/TaskList";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import { getProjectById } from "@/services/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import EditTaskData from "@/components/tasks/EditTaskData";
import DetailTaskModal from "@/components/tasks/DetailTaskModal";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useMemo } from "react";

export default function DetailProjectPage() {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  });

  const canRealizeActions = useMemo(
    () => data?.manager == user?._id,
    [data, user]
  );

  if (isError) return <Navigate to="/404" />;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {data && user && (
        <section className="flex flex-col gap-10 w-full mx-auto">
          <div className="flex flex-col gap-3">
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500">
              {data.description}
            </p>

            {isManager(data.manager, user._id) && (
              <div className="flex flex-col text-center gap-3 md:flex-row">
                <button
                  type="button"
                  className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                  onClick={() => navigate(location.pathname + `?newTask=true`)}
                >
                  Agregar Tarea
                </button>

                <Link
                  to={"team"}
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                >
                  Colaboradores
                </Link>
              </div>
            )}
          </div>

          <TaskList tasks={data.tasks} canRealizeActions={canRealizeActions} />

          <AddTaskModal />
          <EditTaskData />
          <DetailTaskModal />
        </section>
      )}
    </>
  );
}
