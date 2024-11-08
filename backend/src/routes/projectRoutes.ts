import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import {
  hasAuthorization,
  taskBelongsToProject,
  taskExists,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";

const router = Router();

// router.use(authenticate);

// Rutas para el projecto (project)

router.post(
  "/",
  authenticate,
  body("projectName")
    .notEmpty()
    .withMessage("Nombre del Proyecto es obligatorio!"),
  body("clientName")
    .notEmpty()
    .withMessage("Nombre del Cliente es obligatorio!"),
  body("description")
    .notEmpty()
    .withMessage("Descripción del Proyecto es obligatorio!"),
  handleInputErrors,
  ProjectController.createProject
);

router.get("/", authenticate, ProjectController.getAllProjects);

router.get(
  "/:id",
  authenticate,
  param("id").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  "/:id",
  authenticate,
  param("id").isMongoId().withMessage("Id no válido"),
  body("projectName")
    .notEmpty()
    .withMessage("Nombre del Proyecto es obligatorio!"),
  body("clientName")
    .notEmpty()
    .withMessage("Nombre del Cliente es obligatorio!"),
  body("description")
    .notEmpty()
    .withMessage("Descripción del Proyecto es obligatorio!"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  authenticate,
  param("id").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  ProjectController.deleteProject
);

// Rutas para las tarea (task)

router.post(
  "/:projectId/tasks",
  authenticate,
  param("projectId").isMongoId().withMessage("Id no válido"),
  body("name").notEmpty().withMessage("Nombre de la Tarea es obligatoria!"),
  body("description")
    .notEmpty()
    .withMessage("Descripción de la Tarea es obligatoria!"),
  handleInputErrors,
  projectExists,
  hasAuthorization,
  TaskController.createTask
);

router.get(
  "/:projectId/tasks",
  authenticate,
  param("projectId").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  projectExists,
  TaskController.getTasksByProjectId
);

router.get(
  "/:projectId/tasks/:taskId",
  authenticate,
  param("projectId").isMongoId().withMessage("Id del proyecto no válido"),
  param("taskId").isMongoId().withMessage("Id de la tarea no válido"),
  handleInputErrors,
  projectExists,
  taskExists,
  taskBelongsToProject,
  TaskController.getTasksById
);

router.put(
  "/:projectId/tasks/:taskId",
  authenticate,
  param("projectId").isMongoId().withMessage("Id del proyecto no válido"),
  param("taskId").isMongoId().withMessage("Id de la tarea no válido"),
  body("name").notEmpty().withMessage("Nombre de la Tarea es obligatoria!"),
  body("description")
    .notEmpty()
    .withMessage("Descripción de la Tarea es obligatoria!"),
  handleInputErrors,
  projectExists,
  taskExists,
  taskBelongsToProject,
  hasAuthorization,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  authenticate,
  param("projectId").isMongoId().withMessage("Id del proyecto no válido"),
  param("taskId").isMongoId().withMessage("Id de la tarea no válido"),
  handleInputErrors,
  projectExists,
  taskExists,
  taskBelongsToProject,
  hasAuthorization,
  TaskController.deleteTask
);

router.patch(
  "/:projectId/tasks/:taskId/status",
  authenticate,
  param("projectId").isMongoId().withMessage("Id del proyecto no válido"),
  param("taskId").isMongoId().withMessage("Id de la tarea no válido"),
  body("status")
    .notEmpty()
    .withMessage("El estado de la tarea es obligatorio!"),
  handleInputErrors,
  projectExists,
  taskExists,
  taskBelongsToProject,
  TaskController.updateStatusTask
);

// Team

router.post(
  "/:projectId/team/find",
  authenticate,
  body("email")
    .notEmpty()
    .withMessage("Email del Usuario es obligatorio!")
    .isEmail()
    .withMessage("E-mail no válido!"),
  handleInputErrors,
  TeamController.findMemberByEmail
);

router.get(
  "/:projectId/team",
  param("projectId").isMongoId().withMessage("Id no válido"),
  authenticate,
  projectExists,
  handleInputErrors,
  TeamController.getTeamByProject
);

router.post(
  "/:projectId/team",
  authenticate,
  param("projectId").isMongoId().withMessage("Id no válido"),
  body("id").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  projectExists,
  TeamController.addMemberById
);

router.delete(
  "/:projectId/team/:userId",
  authenticate,
  param("projectId").isMongoId().withMessage("Id no válido"),
  param("userId").isMongoId().withMessage("Id no válido"),
  handleInputErrors,
  projectExists,
  TeamController.removeMemberById
);

export default router;
