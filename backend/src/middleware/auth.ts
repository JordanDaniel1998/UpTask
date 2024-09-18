import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../model/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const bearer = request.headers.authorization;
  // Si no existe token, no está autorizado
  if (!bearer) {
    return response.status(401).json({
      error: "No autorizado!",
    });
  }
  // Extraemos el token sin la palabra Bearer
  const [, token] = bearer.split(" ");
  try {
    // Decodificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === "object" && decoded.id) {
      // Obtenemos al usuario por medio del token que contiene el id del usuario
      const user = await User.findById(decoded.id).select("_id name email");
      if (user) {
        // Una vez logueado coloco la información en el request
        request.user = user;
        next();
      } else {
        return response.status(500).json({
          error: "Token no válido!",
        });
      }
    }
  } catch (error) {
    return response.status(500).json({
      error: "Token no válido!",
    });
  }
};
