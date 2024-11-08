import api from "@/lib/axios";
import { Project, Task, TaskFormData, TaskSchema } from "../types";
import { isAxiosError } from "axios";

type TaskAPI = {
  data: TaskFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  status: Task["status"];
};

export async function createTask({
  data,
  projectId,
}: Pick<TaskAPI, "data" | "projectId">) {
  try {
    const { data: response } = await api.post<String>(
      `/projects/${projectId}/tasks`,
      data
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getTaskById({
  projectId,
  taskId,
}: Pick<TaskAPI, "projectId" | "taskId">) {
  try {
    const { data } = await api.get(`/projects/${projectId}/tasks/${taskId}`);
    const response = TaskSchema.safeParse(data);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updateTask({
  projectId,
  taskId,
  data,
}: Pick<TaskAPI, "projectId" | "taskId" | "data">) {
  try {
    const { data: response } = await api.put<String>(
      `/projects/${projectId}/tasks/${taskId}`,
      data
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteTask({
  projectId,
  taskId,
}: Pick<TaskAPI, "projectId" | "taskId">) {
  try {
    const { data: response } = await api.delete<String>(
      `/projects/${projectId}/tasks/${taskId}`
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updateStatusTask({
  projectId,
  taskId,
  status,
}: Pick<TaskAPI, "projectId" | "taskId" | "status">) {
  try {
    const { data: response } = await api.patch<String>(
      `/projects/${projectId}/tasks/${taskId}/status`,
      {
        status: status,
      }
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
