import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";

export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  // Document -> Permite incluir los campos y métodos proporcionados por MongoDB a los documentos como (_id, createdAt, updatedAt, etc.)
  tasks: PopulatedDoc<ITask & Document>[];
  manager: PopulatedDoc<IUser & Document>;
  team: PopulatedDoc<IUser & Document>[];
}

const ProjectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: "Task", // Permite obtener el objeto al que hace referencia por medio de id
      },
    ],
    manager: {
      type: Types.ObjectId,
      ref: "User",
    },
    team: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true } // Agrega los campos de createdAt y UpdatedAt
);

const Project = mongoose.model<IProject>("Project", ProjectSchema);
export default Project;

// Un proyecto solo puede pertenecer a un manager
