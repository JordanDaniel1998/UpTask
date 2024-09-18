import api from "@/lib/axios";
import { DashboardProjectSchema, Project, ProjectFormData } from "../types";
import { isAxiosError } from "axios";

export async function createProject(data: ProjectFormData) {
  try {
    const { data: response } = await api.post<String>("/projects", data);
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getAllProjects() {
  try {
    const { data } = await api.get("/projects");
    const response = DashboardProjectSchema.safeParse(data);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectById(id: Project["_id"]) {
  try {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

type UpdateProjectProps = {
  data: ProjectFormData;
  projectId: Project["_id"];
};

export async function updateProject({ data, projectId }: UpdateProjectProps) {
  try {
    const { data: response } = await api.put<String>(
      `/projects/${projectId}`,
      data
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteProject(id: Project["_id"]) {
  try {
    const { data: response } = await api.delete<String>(`/projects/${id}`);
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
