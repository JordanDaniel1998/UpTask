import ProjectForm from "@/components/projects/ProjectForm";
import { updateProject } from "@/services/ProjectAPI";
import { Project, ProjectFormData } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type EditProjectFormProps = {
  data: ProjectFormData;
  projectId: Project["_id"];
};

export default function EditProjectForm({
  data,
  projectId,
}: EditProjectFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: data.projectName,
      clientName: data.clientName,
      description: data.description,
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      // Evita que los datos sean cacheados, es decir renderiza nuevamente para traer los nuevos datos
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
      queryClient.invalidateQueries({ queryKey: ["edit-project", projectId] });
      toast.success(response);
      navigate("/");
    },
  });

  const handleSubmitForm = (data: ProjectFormData) => {
    const dataToUpdate = {
      projectId: projectId,
      data: data,
    };
    // mutate -> Solo permite pasar una sola variable como argumento
    mutate(dataToUpdate);
  };

  return (
    <>
      <section className="flex flex-col gap-10 w-full lg:max-w-3xl mx-auto">
        <div className="flex flex-col gap-3">
          <h1 className="text-5xl font-black">Crear Proyecto</h1>
          <p className="text-2xl font-light text-gray-500">
            Completa el siguiente formulario para crear un proyecto
          </p>

          <div>
            <Link
              className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors inline-block"
              to="/"
            >
              Volver a Proyectos
            </Link>
          </div>
        </div>

        <form
          className="bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleSubmitForm)}
          noValidate
        >
          <ProjectForm register={register} errors={errors} />

          <input
            type="submit"
            value="Guardar Cambios"
            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full text-white uppercase p-3 font-bold cursor-pointer transition-colors"
          />
        </form>
      </section>
    </>
  );
}
