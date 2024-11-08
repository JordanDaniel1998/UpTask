import { Project, Team } from "../types";

export const isManager = (managerId: Project["_id"], userId: Team["_id"]) => {
  return managerId === userId;
};
