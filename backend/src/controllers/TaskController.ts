import type { Request, Response } from "express";
import Task from "../model/Task";

export class TaskController {
  static createTask = async (request: Request, response: Response) => {
    try {
      const task = new Task(request.body);
      task.project = request.project.id;
      request.project.tasks.push(task.id);
      // Ejecuta ambas promesas en paralelo
      await Promise.allSettled([task.save(), request.project.save()]);
      return response.send("Tarea Creada Correctamente");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static getTasksByProjectId = async (request: Request, response: Response) => {
    try {
      const tasks = await Task.find({
        project: request.project.id,
      }).populate("project");
      return response.send(tasks);
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static getTasksById = async (request: Request, response: Response) => {
    try {
      const task = await Task.findById(request.task.id).populate({
        path: "completedBy.user",
        select: "id name email",
      });
      return response.json(task);
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static updateTask = async (request: Request, response: Response) => {
    try {
      request.task.name = request.body.name;
      request.task.description = request.body.description;

      await request.task.save();
      return response.send("Tarea Actualizada");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static deleteTask = async (request: Request, response: Response) => {
    try {
      // Eliminar la referencia de la tarea en el proyecto al cual pertenece
      request.project.tasks = request.project.tasks.filter(
        (task) => task.toString() !== request.task.id.toString()
      );

      await Promise.allSettled([
        request.task.deleteOne(),
        request.project.save(),
      ]);
      return response.send("Tarea Eliminada");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static updateStatusTask = async (request: Request, response: Response) => {
    try {
      const { status } = request.body;

      // Eliminar la referencia de la tarea en el proyecto al cual pertenece
      request.task.status = status;

      const data = {
        user: request.user.id,
        status: status,
      };

      request.task.completedBy.push(data);

      await request.task.save();

      return response.send("El estado de la tarea fue actualizado");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };
}
