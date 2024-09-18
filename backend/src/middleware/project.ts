import type { NextFunction, Request, Response } from "express";
import Project, { IProject } from "../model/Project";

// Permite reescribir el request sin borrar los datos previos que ya tiene
declare global {
  namespace Express {
    interface Request {
      project: IProject; // Agregamos la variable al request
    }
  }
}

export async function projectExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { projectId } = request.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return response.status(404).json({
        error: "Proyecto no encontrado!",
      });
    }
    // Seteamos el projecto en el request
    request.project = project;
    next();
  } catch (error) {
    response.status(500).json({
      error: "Hubo un error!",
    });
  }
}
