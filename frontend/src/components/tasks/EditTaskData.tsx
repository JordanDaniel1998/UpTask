import { getTaskById } from "@/services/TaskAPI";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useParams } from "react-router-dom";
import Spinner from "../spinners/Spinner";
import EditTaskModal from "./EditTaskModal";

export default function EditTaskData() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("editTask")!;

  const params = useParams();
  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["edit-task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId, // Permite habilitar cuando se ejecutará la consulta en base a un booleano (true -> ejecuta el query | false -> no ejecuta el query)
    retry: false,
  });

  if (isError) return <Navigate to={"/404"} />;

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>{data && <EditTaskModal data={data} taskId={taskId} />}</>
      )}
    </>
  );
}
