import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  CheckPassword,
  ConfirmToken,
  ForgotPasswordForm,
  NewPassword,
  RequestConfirmationCodeForm,
  User,
  UserLoginForm,
  UserRegisterForm,
} from "../types";

export async function createAccount(formData: UserRegisterForm) {
  try {
    const { data: response } = await api.post<string>(
      "/auth/create-account",
      formData
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function confirmAccount(token: ConfirmToken["token"]) {
  try {
    const { data: response } = await api.post<string>("/auth/confirm-account", {
      token: token,
    });
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

// Solicitar nuevo código
export async function requestConfirmationCode(
  data: RequestConfirmationCodeForm
) {
  try {
    const { data: response } = await api.post<string>("/auth/request-code", {
      email: data.email,
    });
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function authenticateUser(data: UserLoginForm) {
  try {
    const { data: response } = await api.post<string>("/auth/login", data);
    localStorage.setItem("AUTH_TOKEN_UPTASK_API", response);
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function forgotPassword(data: ForgotPasswordForm) {
  try {
    const { data: response } = await api.post<string>("/auth/forgot-password", {
      email: data.email,
    });
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function validateToken(token: ConfirmToken["token"]) {
  try {
    const { data: response } = await api.post<string>("/auth/validate-token", {
      token: token,
    });
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updatePasswordWithToken({
  token,
  data,
}: {
  token: ConfirmToken["token"];
  data: NewPassword;
}) {
  try {
    const { data: response } = await api.post<string>(
      `/auth/update-password/${token}`,
      {
        password: data.password,
        password_confirmation: data.password_confirmation,
      }
    );

    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getUserAuthenticate() {
  try {
    const { data: user } = await api.get<User>("/auth/user");
    return user;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function checkProfilePassword(formData: CheckPassword) {
  try {
    const { data } = await api.post<string>("/auth/check-password", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
