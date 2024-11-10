import AlertMessage from "@/components/AlertMessage";
import { updateProfilePassword } from "@/services/ProfileApi";
import { ProfilePasswordSchema } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const initialValues = {
    current_password: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfilePasswordSchema>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updateProfilePassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
    },
  });

  const passwordWatch = watch("password");

  const handleChangePassword = (formData: ProfilePasswordSchema) => {
    mutate(formData);
  };

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-black ">Cambiar Contraseña</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Utiliza este formulario para cambiar tu password
        </p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="current_password"
            >
              Contraseña Actual
            </label>
            <input
              id="current_password"
              type="password"
              placeholder="Contraseña Actual"
              className="w-full p-3  border border-gray-200"
              {...register("current_password", {
                required: "El password actual es obligatorio",
              })}
            />
            {errors.current_password && (
              <AlertMessage>{errors.current_password.message}</AlertMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="password">
              Nueva Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Nueva Contraseña"
              className="w-full p-3  border border-gray-200"
              {...register("password", {
                required: "La nueva contraseña es obligatorio",
                minLength: {
                  value: 8,
                  message: "La contraseña debe ser mínimo de 8 caracteres",
                },
              })}
            />
            {errors.password && (
              <AlertMessage>{errors.password.message}</AlertMessage>
            )}
          </div>
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-sm uppercase font-bold"
            >
              Repetir Contraseña
            </label>

            <input
              id="password_confirmation"
              type="password"
              placeholder="Repetir Contraseña"
              className="w-full p-3  border border-gray-200"
              {...register("password_confirmation", {
                required: "Este campo es obligatorio",
                validate: (value) =>
                  value === passwordWatch || "Los Passwords no son iguales",
              })}
            />
            {errors.password_confirmation && (
              <AlertMessage>
                {errors.password_confirmation.message}
              </AlertMessage>
            )}
          </div>

          <input
            type="submit"
            value="Cambiar Contraseña"
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
