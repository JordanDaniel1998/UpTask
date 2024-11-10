import mongoose, { Document, Schema, Types } from "mongoose";

export interface INote extends Document {
  content: string;
  createdBy: Types.ObjectId;
  task: Types.ObjectId;
}

export const NoteSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;

// Un proyecto puede muchas tareas
// Una tarea solo le puede pertenecer a un proyecto
