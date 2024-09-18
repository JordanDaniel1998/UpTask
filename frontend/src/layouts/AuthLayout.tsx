import Logo from "@/components/Logo";
import { Link, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <>
      <section className="bg-gray-800 min-h-screen flex justify-center items-center py-10">
        <div className="w-11/12 md:w-[600px]">
          <Link to="/">
            <Logo />
          </Link>
          <div>
            <Outlet />
          </div>
        </div>
      </section>

      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
}
