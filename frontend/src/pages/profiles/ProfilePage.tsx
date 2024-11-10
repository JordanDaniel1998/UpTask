import ProfileForm from "@/components/profile/ProfileForm";
import Spinner from "@/components/spinners/Spinner";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { data, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return <>{data && <ProfileForm data={data} />}</>;
}
