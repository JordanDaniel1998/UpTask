import ProjectForm from "@/components/projects/ProjectForm";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { createProject } from "@/services/ProjectAPI";
import { ProjectFormData } from "@/types/index";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createProject, // Función a ejecutar
    onError: (error) => {
      // Si falla la solicitud
      toast.error(error.message);
    },
    onSuccess: (response) => {
      // Si fue exitosa la solicitud
      toast.success(response);
      navigate("/");
    },
  });

  const handleSubmitForm = (data: ProjectFormData) => {
    mutate(data); // Envía la data a través de la función y ejecuta la mutación
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
            value="Crear Proyecto"
            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full text-white uppercase p-3 font-bold cursor-pointer transition-colors"
          />
        </form>
      </section>
    </>
  );
}
