import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <h1 className="font-black text-center text-4xl text-white">
        Página no encontrada
      </h1>

      <p className="text-white text-center mt-10">
        Tal vez quieras regresar a{" "}
        <Link to={"/"} className="text-fuchsia-500">
          Proyectos
        </Link>
      </p>
    </>
  );
}
