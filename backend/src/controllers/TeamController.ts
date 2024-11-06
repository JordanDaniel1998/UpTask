import type { Request, Response } from "express";
import Task from "../model/Task";
import User from "../model/User";
import Project from "../model/Project";

export class TeamController {
  static findMemberByEmail = async (request: Request, response: Response) => {
    try {
      const { email } = request.body;

      const user = await User.findOne({ email: email }).select("id email name");

      if (!user) {
        return response.status(404).json({
          error: "Usuario no encontrado!",
        });
      }

      response.json(user);
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static addMemberById = async (request: Request, response: Response) => {
    try {
      const { id } = request.body;

      const user = await User.findById(id).select("id");

      if (!user) {
        return response.status(404).json({
          error: "Usuario no encontrado!",
        });
      }

      if (
        request.project.team.some(
          (team) => team.toString() === user.id.toString()
        )
      ) {
        return response.status(409).json({
          error: "El usuario ya existe en el proyecto!",
        });
      }

      request.project.team.push(user.id);
      await request.project.save();

      response.send("Usuario agregado correctamente");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static getTeamByProject = async (request: Request, response: Response) => {
    try {
      const project = await Project.findById(request.project.id).populate({
        path: "team",
        select: "_id email name",
      });

      response.json(project.team);
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static removeMemberById = async (request: Request, response: Response) => {
    try {
      const { userId } = request.params;

      if (!request.project.team.some((team) => team.toString() === userId)) {
        return response.status(409).json({
          error: "El usuario no existe en el proyecto!",
        });
      }

      request.project.team = request.project.team.filter(
        (member) => member.toString() !== userId
      );

      await request.project.save();

      response.send("El usuario fue removido del proyecto");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };
}
