import { Link, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Logo from "@/components/Logo";
import { NavMenu } from "@/components/NavMenu";
import "react-toastify/dist/ReactToastify.css";
import "@/components/spinners/spinner.css";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout() {
  const { data, isError, isLoading } = useAuth();

  if (isError) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <>
      {!isLoading && data && (
        <>
          <header className="bg-gray-800 py-5">
            <div className="w-11/12 lg:w-9/12 mx-auto flex flex-col lg:flex-row justify-between items-center">
              <div className="w-64">
                <Link to="/">
                  <Logo />
                </Link>
              </div>

              <NavMenu name={data.name} />
            </div>
          </header>

          <main className="w-11/12 lg:w-9/12 mx-auto mt-10">
            <Outlet />
          </main>

          <footer className="py-5">
            <p className="text-center">Todos los derechos reservados</p>
          </footer>

          <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        </>
      )}
    </>
  );
}
