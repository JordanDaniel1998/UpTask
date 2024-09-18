import { useForm } from "react-hook-form";
import { UserRegisterForm } from "@/types/index";
import AlertMessage from "@/components/AlertMessage";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createAccount } from "@/services/AuthAPI";

export default function RegisterPage() {
  const initialValues: UserRegisterForm = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserRegisterForm>({ defaultValues: initialValues });

  // Permite observar el valor de un campo en el formulario
  const passwordWatch = watch("password");

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
    },
  });

  const handleRegister = (formData: UserRegisterForm) => {
    mutate(formData);
    reset();
  };

  return (
    <>
      <h1 className="text-5xl font-black text-white">Crear Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5">
        Llena el formulario para {""}
        <span className=" text-fuchsia-500 font-bold"> crear tu cuenta</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-8 p-10  bg-white mt-10"
        noValidate
      >
        <div className="flex flex-col gap-3">
          <label className="font-normal text-lg" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <AlertMessage>{errors.email.message}</AlertMessage>}
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-normal text-lg">Nombre</label>
          <input
            type="name"
            placeholder="Nombre de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("name", {
              required: "El Nombre de usuario es obligatorio",
            })}
          />
          {errors.name && <AlertMessage>{errors.name.message}</AlertMessage>}
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-normal text-lg">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: "El Password debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <AlertMessage>{errors.password.message}</AlertMessage>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-normal text-lg">Repetir Password</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("password_confirmation", {
              required: "Repetir Password es obligatorio",
              validate: (value) =>
                value === passwordWatch || "Las contraseñas no coinciden",
            })}
          />

          {errors.password_confirmation && (
            <AlertMessage>{errors.password_confirmation.message}</AlertMessage>
          )}
        </div>

        <input
          type="submit"
          value="Registrarme"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to={"/auth/login"}
          className="text-center text-gray-300 font-normal"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>

        <Link
          to={"/auth/forgot-password"}
          className="text-center text-gray-300 font-normal"
        >
          ¿Olvidaste tu contraseña? Reestablecer
        </Link>
      </nav>
    </>
  );
}
