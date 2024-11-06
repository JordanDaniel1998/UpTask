import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  Project,
  Team,
  TeamMemberForm,
  TeamMemberSchema,
  TeamMembersSchema,
} from "../types";
import { TeamMembers } from "../types/index";

type FindUserByEmailProps = {
  formData: TeamMemberForm;
  projectId: Project["_id"];
};

export async function findUserByEmail({
  formData,
  projectId,
}: FindUserByEmailProps) {
  try {
    const { data: team } = await api.post<Team>(
      `/projects/${projectId}/team/find`,
      formData
    );
    const response = TeamMemberSchema.safeParse(team);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

type AddMemberByIdProps = {
  userId: Team["_id"];
  projectId: Project["_id"];
};

export async function addUserToProject({
  projectId,
  userId,
}: AddMemberByIdProps) {
  try {
    const { data: message } = await api.post<string>(
      `/projects/${projectId}/team`,
      {
        id: userId,
      }
    );
    return message;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getTeamByProject(projectId: Project["_id"]) {
  try {
    const { data: team } = await api.get<TeamMembers>(
      `/projects/${projectId}/team`
    );
    const response = TeamMembersSchema.safeParse(team);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

type RemoveMemberByIdProps = {
  userId: Team["_id"];
  projectId: Project["_id"];
};

export async function removeMemberById({
  projectId,
  userId,
}: RemoveMemberByIdProps) {
  try {
    const { data: message } = await api.delete<string>(
      `/projects/${projectId}/team/${userId}`
    );
    return message;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
