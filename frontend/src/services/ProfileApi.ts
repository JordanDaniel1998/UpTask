import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { ProfilePasswordSchema, UserProfileForm } from "../types";

export async function updateProfile(formData: UserProfileForm) {
  try {
    const { data: response } = await api.put<string>("/auth/profile", formData);
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updateProfilePassword(formData: ProfilePasswordSchema) {
  try {
    const { data: response } = await api.put<string>(
      "/auth/update-password",
      formData
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
