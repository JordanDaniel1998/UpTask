import { validateToken } from "@/services/AuthAPI";
import { ConfirmToken } from "@/types/index";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type NewPasswordTokenProps = {
  token: ConfirmToken["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  const { mutate } = useMutation({
    mutationFn: validateToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
      setIsValidToken(true);
    },
  });

  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };
  const handleComplete = (token: ConfirmToken["token"]) => {
    mutate(token);
  };

  return (
    <>
      <form className="space-y-8 py-10 rounded-lg bg-white mt-10">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center items-center gap-5">
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            <PinInputField className="size-8 sm:size-10 p-0 sm:p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
            <PinInputField className="size-8 sm:size-10 p-0 sm:p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
            <PinInputField className="size-8 sm:size-10 p-0 sm:p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
            <PinInputField className="size-8 sm:size-10 p-0 sm:p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
            <PinInputField className="size-8 sm:size-10 p-0 sm:p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
            <PinInputField className="size-8 sm:size-10 p-0 sm:p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
          </PinInput>
        </div>
      </form>
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}