import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Note, NoteForm, Project, Task } from "../types";

type NoteType = {
  formData: NoteForm;
  projectId: Project["_id"];
  taskId: Task["_id"];
};

export async function createNote({ formData, projectId, taskId }: NoteType) {
  try {
    const { data: response } = await api.post<String>(
      `/projects/${projectId}/task/${taskId}/notes`,
      formData
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getNotesByTask({ projectId, taskId }: NoteType) {
  try {
    const { data: response } = await api.get<String>(
      `/projects/${projectId}/task/${taskId}/notes`
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

type NoteTypeProps = {
  projectId: Project["_id"];
  taskId: Task["_id"];
  noteId: Note["_id"];
};

export async function removeNoteById({
  projectId,
  taskId,
  noteId,
}: NoteTypeProps) {
  try {
    const { data: response } = await api.delete<String>(
      `/projects/${projectId}/task/${taskId}/notes/${noteId}`
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
