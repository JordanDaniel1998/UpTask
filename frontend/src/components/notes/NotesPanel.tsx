import { Note } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";
import { useAuth } from "@/hooks/useAuth";

type NotesPanelProps = {
  notes: Note[];
};

export default function NotesPanel({ notes }: NotesPanelProps) {
  const { data: user } = useAuth();

  return (
    <>
      <AddNoteForm />
      {notes.length > 0 && user && (
        <div className="divide-y divide-gray-100">
          <p className="font-bold text-2xl text-slate-600 my-5">Notas:</p>
          <div className="flex flex-col gap-5">
            {notes.map((note) => (
              <NoteDetail key={note._id} note={note} user={user} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
