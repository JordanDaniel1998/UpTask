import { addUserToProject } from "@/services/TeamApi";
import { Team } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type SearchResultProps = {
  user: Team;
  resetForm: () => void;
};

export default function SearchResult({ user, resetForm }: SearchResultProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["project-team", projectId],
      });
      navigate(location.pathname, { replace: true });
    },
  });

  const handleAddUserToProject = () => {
    mutate({
      userId: user._id,
      projectId: projectId,
    });
  };
  return (
    <>
      <div className="flex flex-col gap-5 md:flex-row justify-between md:items-center">
        <div className="flex flex-col gap-2">
          <p>
            <span className="font-bold">Username:</span> {user.name}
          </p>
          <p>
            <span className="font-bold">Email:</span> {user.email}
          </p>
        </div>

        <div className="flex items-center justify-center">
          <button
            className="text-purple-600 hover:bg-purple-100 cursor-pointer p-4 md:duration-300 w-full"
            onClick={handleAddUserToProject}
          >
            Agregar al proyecto
          </button>
        </div>
      </div>
    </>
  );
}
