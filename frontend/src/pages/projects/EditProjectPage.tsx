import { getProjectById } from "@/services/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import EditProjectForm from "./EditProjectForm";
import Spinner from "@/components/spinners/Spinner";

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.projectId!; // Asegurar que si existe el id

  const { data, isLoading, isError } = useQuery({
    queryKey: ["edit-project", projectId], // Identificador único
    queryFn: () => getProjectById(projectId), // Función a ejecutar
    retry: false, // Evita que react-query haga un reintento de consultas(3) en caso no se obtengan datos a la primera petición
  });

  if (isError) return <Navigate to="/404" />;

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <EditProjectForm data={data} projectId={projectId} />
      )}
    </>
  );
}
