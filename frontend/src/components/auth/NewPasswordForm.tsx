import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AlertMessage from "@/components/AlertMessage";
import { ConfirmToken, NewPassword } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordWithToken } from "@/services/AuthAPI";
import { toast } from "react-toastify";

type NewPasswordFormProps = {
  token: ConfirmToken["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

export default function NewPasswordForm({
  token,
  setToken,
}: NewPasswordFormProps) {
  const navigate = useNavigate();
  const initialValues: NewPassword = {
    password: "",
    password_confirmation: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updatePasswordWithToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
      reset();
      setToken("");
      navigate("/auth/login");
    },
  });

  const handleNewPassword = (formData: NewPassword) => {
    const data = {
      token: token,
      data: formData,
    };
    mutate(data);
  };

  const passwordWatch = watch("password");

  return (
    <>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className="space-y-8 p-10  bg-white mt-10"
        noValidate
      >
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
                value === passwordWatch || "Los Passwords no son iguales",
            })}
          />

          {errors.password_confirmation && (
            <AlertMessage>{errors.password_confirmation.message}</AlertMessage>
          )}
        </div>

        <input
          type="submit"
          value="Establecer Password"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>
    </>
  );
}
