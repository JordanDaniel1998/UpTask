import type { NextFunction, Request, Response } from "express";
import Task, { ITask } from "../model/Task";

// Permite reescribir el request sin borrar los datos previos que ya tiene
declare global {
  namespace Express {
    interface Request {
      task: ITask; // Agregamos la variable al request
    }
  }
}

export async function taskExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { taskId } = request.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return response.status(404).json({
        error: "Tarea no encontrada!",
      });
    }
    // Seteamos la tarea en el request
    request.task = task;
    next();
  } catch (error) {
    response.status(500).json({
      error: "Hubo un error!",
    });
  }
}

export function taskBelongsToProject(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Validar que la tarea que solicito pertenezca al proyecto
  if (request.task.project.toString() !== request.project.id.toString()) {
    return response.status(400).json({
      error: "Acción no válida!",
    });
  }
  next();
}
