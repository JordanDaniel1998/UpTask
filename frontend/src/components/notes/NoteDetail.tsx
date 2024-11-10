import { Note, User } from "@/types/index";
import { formatDate } from "../../utils/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeNoteById } from "@/services/NoteApi";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";

type NoteDetailProps = {
  note: Note;
  user: User;
};

export default function NoteDetail({ note, user }: NoteDetailProps) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;

  const params = useParams();
  const projectId = params.projectId!;

  const isBelongNoteToUser = (): boolean => {
    return note.createdBy._id.toString() === user._id.toString();
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: removeNoteById,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["view-task", taskId] });
    },
  });

  const deleteNote = () => {
    mutate({
      projectId: projectId,
      taskId: taskId,
      noteId: note._id,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-1 bg-fuchsia-100 p-3 rounded-md hover:bg-fuchsia-200 md:duration-300">
        <p>{note.content}</p>
        <p className="font-bold text-xs">
          {formatDate(note.createdAt)}{" "}
          <span className="text-xs uppercase bg-green-50 text-green-500 border-2 border-green-500 rounded-lg inline-block py-1 px-5">
            {note.createdBy.name}
          </span>
          {isBelongNoteToUser() && (
            <button
              className="text-xs uppercase bg-red-50 text-red-500 border-2 red-green-500 rounded-lg inline-block py-1 px-5"
              onClick={deleteNote}
            >
              Eliminar
            </button>
          )}
        </p>
      </div>
    </>
  );
}
