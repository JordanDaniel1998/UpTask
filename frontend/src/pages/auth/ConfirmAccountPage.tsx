import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { confirmAccount } from "@/services/AuthAPI";
import { toast } from "react-toastify";

export default function ConfirmAccountPage() {
  const [token, setToken] = useState<ConfirmToken["token"]>("");

  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };

  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
    },
  });

  // Se dispara en automatico cuando se termine de llenar los inputs
  const handleComplete = (token: ConfirmToken["token"]) => {
    mutate(token);
  };

  return (
    <>
      <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste {""}
        <span className=" text-fuchsia-500 font-bold"> por e-mail</span>
      </p>
      <form className="space-y-8 bg-white mt-10 py-10">
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
          to="/auth/request-code"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
