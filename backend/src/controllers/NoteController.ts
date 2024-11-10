import type { Request, Response } from "express";
import Note, { INote } from "../model/Note";
import { Types } from "mongoose";

type NoteParams = {
  noteId: Types.ObjectId;
};

export class NoteController {
  static createNote = async (
    request: Request<{}, {}, INote>,
    response: Response
  ) => {
    try {
      const note = new Note();
      note.content = request.body.content;
      note.createdBy = request.user.id;
      note.task = request.task.id;

      request.task.notes.push(note.id);

      await Promise.allSettled([request.task.save(), note.save()]);

      return response.send("Nota creada correctamente");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static getNotesByTask = async (
    request: Request<{}, {}, INote>,
    response: Response
  ) => {
    try {
      const note = await Note.find({ task: request.task.id });
      return response.json(note);
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static removeNoteById = async (
    request: Request<NoteParams>,
    response: Response
  ) => {
    try {
      const { noteId } = request.params;
      const note = await Note.findById(noteId);

      if (!note) {
        return response.status(404).json({
          error: "Nota no encontrada!",
        });
      }

      if (request.user.id.toString() !== note.createdBy.toString()) {
        return response.status(400).json({
          error: "Acción no válida!",
        });
      }

      request.task.notes = request.task.notes.filter(
        (item) => item.toString() !== note.id.toString()
      );

      await Promise.allSettled([request.task.save(), note.deleteOne()]);

      return response.send("Nota eliminada correctamente");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };
}
