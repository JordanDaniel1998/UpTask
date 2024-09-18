import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whileList = [process.env.FRONTEND_URL];
    // Para conectarnos desde algún programa que nos permita hacer pruebas con nuestra api, en estos programas por lo general el origin es undefined, recordar que esto es un script creado por nosotros
    if (process.argv[2] === "--api") {
      whileList.push(undefined);
    }
    // Permite habilitar el cors, si es que nuestro origen es la URL del frontend asignada
    if (whileList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS!"), false);
    }
  },
};
