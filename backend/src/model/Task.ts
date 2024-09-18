import mongoose, { Document, Schema, Types } from "mongoose";

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
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;

// Un proyecto puede muchas tareas
// Una tarea solo le puede pertenecer a un proyecto
