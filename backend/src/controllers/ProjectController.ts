import type { Request, Response } from "express";
import Project from "../model/Project";

export class ProjectController {
  static createProject = async (request: Request, response: Response) => {
    const project = new Project(request.body);
    project.manager = request.user.id;
    try {
      // throw new Error("Generar un error a propósito");
      await project.save();
      return response.send("Proyecto Creado Correctamente");
    } catch (error) {
      return response.status(404).json({
        error: "No se pudo crear el proyecto!",
      });
    }
  };

  static getAllProjects = async (request: Request, response: Response) => {
    try {
      // Obtenemos solo proyectos del usuario autenticado
      const projects = await Project.find({
        $or: [
          {
            manager: {
              $in: request.user.id,
            },
          },
          { team: { $in: request.user.id } },
        ],
      });
      return response.status(200).json(projects);
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static getProjectById = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
      const project = await Project.findById(id).populate("tasks");
      if (!project) {
        return response.status(404).json({
          error: "Proyecto no encontrado!",
        });
      }

      if (
        project.manager.toString() !== request.user.id.toString() &&
        !project.team.includes(request.user.id)
      ) {
        return response.status(404).json({
          error: "Acción no válida!",
        });
      }

      return response.status(200).json(project);
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static updateProject = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
      const project = await Project.findById(id);
      if (!project) {
        return response.status(404).json({
          error: "Proyecto no encontrado!",
        });
      }

      if (project.manager.toString() !== request.user.id.toString()) {
        return response.status(404).json({
          error: "Solo el Manager puede actualizar el proyecto!",
        });
      }

      project.clientName = request.body.clientName;
      project.projectName = request.body.projectName;
      project.description = request.body.description;

      await project.save();
      return response.status(200).send("Proyecto Actualizado");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static deleteProject = async (request: Request, response: Response) => {
    // Obs: Si se elimina un proyecto se debe eliminar todas las tareas asociadas a dicho proyecto
    const { id } = request.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        return response.status(404).json({
          error: "Proyecto no encontrado!",
        });
      }

      if (project.manager.toString() !== request.user.id.toString()) {
        return response.status(404).json({
          error: "Solo el Manager puede eliminar el proyecto!",
        });
      }

      await project.deleteOne();
      return response.send("Proyecto eliminado");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };
}
