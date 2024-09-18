import { getUserAuthenticate } from "@/services/AuthAPI";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["profile-user"],
    queryFn: getUserAuthenticate,
    retry: false, //1
    refetchOnWindowFocus: false,
  });

  return { data, isError, isLoading };
};
