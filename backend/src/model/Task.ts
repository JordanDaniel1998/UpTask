import mongoose, { Document, Schema, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const; // Convertimos las variables a constantes, es decir solo pueden ser leídas mas no modificables

// Accede al objeto a través de sus llaves y obtiene sus valores
export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  completedBy: {
    user: Types.ObjectId;
    status: TaskStatus;
  }[];
  notes: Types.ObjectId[];
}

export const TaskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: Types.ObjectId,
      ref: "Project", // Permite obtener el objeto al que hace referencia por medio de su id
    },
    status: {
      type: String,
      enum: Object.values(taskStatus), // Esto es especialmente útil cuando quieres asegurarte de que un campo solo pueda tomar ciertos valores específicos.
      default: taskStatus.PENDING,
    },
    completedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          default: null,
        },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING,
        },
      },
    ],
    notes: [
      {
        type: Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true }
);

// Mongoose Middlewares
TaskSchema.pre(
  "deleteOne", // Antes de que alguna función dispare el deleteOne asociado al modelo, se ejecuta esta función
  { document: true },
  async function () {
    const taskId = this._id;
    if (!taskId) return;
    await Note.deleteMany({ task: taskId });
  }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;

// Un proyecto puede muchas tareas
// Una tarea solo le puede pertenecer a un proyecto
