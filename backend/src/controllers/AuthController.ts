import type { Request, Response } from "express";
import User from "../model/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../model/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (request: Request, response: Response) => {
    try {
      const { email, password } = request.body;

      // Prevenir duplicados con el email
      const isUser = await User.findOne({ email: email });
      if (isUser) {
        return response.status(409).json({
          error: "El usuario ya está registrado!",
        });
      }

      // Crea un usuario nuevo
      const user = new User(request.body);
      user.password = await hashPassword(password);

      // Generar el token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Enviar el email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([token.save(), user.save()]);

      return response.send(
        "Cuenta creada, revisa tu email para confirmar tu cuenta"
      );
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error al crear la cuenta!",
      });
    }
  };

  static confirmAccount = async (request: Request, response: Response) => {
    try {
      const { token } = request.body;

      const istoken = await Token.findOne({ token: token });
      if (!istoken) {
        return response.status(401).json({
          error: "Token no válido!",
        });
      }
      const user = await User.findById(istoken.user);
      user.confirmed = true;

      await Promise.allSettled([istoken.deleteOne(), user.save()]);

      return response.send("Cuenta Confirmada Correctamente");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error al confirmar la cuenta!",
      });
    }
  };

  static login = async (request: Request, response: Response) => {
    try {
      const { email, password } = request.body;
      const isUser = await User.findOne({ email: email });

      if (!isUser) {
        return response.status(404).json({
          error: "Usuario no encontrado!",
        });
      }

      if (!isUser.confirmed) {
        // Envíamos nuevamente un token
        const token = new Token();
        token.user = isUser.id;
        token.token = generateToken();
        await token.save();

        // Enviar el email
        AuthEmail.sendConfirmationEmail({
          email: isUser.email,
          name: isUser.name,
          token: token.token,
        });

        return response.status(404).json({
          error:
            "La cuenta aún no ah sido confirmada, hemos enviado un email de confirmación!",
        });
      }

      const isPasswordCorrect = await checkPassword(password, isUser.password);

      if (!isPasswordCorrect) {
        return response.status(404).json({
          error: "Credenciales incorrectas!",
        });
      }

      // JsonWebToken
      const token = generateJWT({
        id: isUser.id,
      });

      return response.send(token);
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error en la cuenta!",
      });
    }
  };

  // Solicitar nuevo código
  static requestConfirmationCode = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { email } = request.body;

      const user = await User.findOne({ email: email });
      if (!user) {
        return response.status(404).json({
          error: "El usuario no existe!",
        });
      }

      if (user.confirmed) {
        return response.status(403).json({
          error: "El usuario ya fue confirmado!",
        });
      }

      // Generar el token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Enviar el email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await token.save();

      return response.send("Se ah enviado un nuevo token a tu email");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error al confirmar la cuenta!",
      });
    }
  };

  static forgotPassword = async (request: Request, response: Response) => {
    try {
      const { email } = request.body;

      const user = await User.findOne({ email: email });
      if (!user) {
        return response.status(404).json({
          error: "El usuario no existe!",
        });
      }

      // Generar el token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Enviar el email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await token.save();

      return response.send("Revisa tu email y sigue las instrucciones");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error en la cuenta!",
      });
    }
  };

  static validateToken = async (request: Request, response: Response) => {
    try {
      const { token } = request.body;

      const istoken = await Token.findOne({ token: token });
      if (!istoken) {
        return response.status(401).json({
          error: "Token no válido!",
        });
      }

      return response.send("Token válido, ingresa tu nueva contraseña");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error en la cuenta!",
      });
    }
  };

  static updatePasswordWithToken = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { token } = request.params;

      const istoken = await Token.findOne({ token: token });
      if (!istoken) {
        return response.status(401).json({
          error: "Token no válido!",
        });
      }

      const { password } = request.body;

      const user = await User.findById(istoken.user);
      user.password = await hashPassword(password);

      await Promise.allSettled([istoken.deleteOne(), user.save()]);

      return response.send("Credenciales actualizadas");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error en la cuenta!",
      });
    }
  };

  static user = async (request: Request, response: Response) => {
    try {
      return response.json(request.user);
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error en la cuenta!",
      });
    }
  };

  static updateProfile = async (request: Request, response: Response) => {
    try {
      const { name, email } = request.body;

      const user = await User.findOne({ email });
      if (user && user.id.toString() !== request.user.id.toString()) {
        return response.status(409).json({
          error: "El email ya existe!",
        });
      }
      request.user.name = name;
      request.user.email = email;
      await request.user.save();

      return response.send("Perfil actualizado correctamente");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error!",
      });
    }
  };

  static updateProfilePassword = async (
    request: Request,
    response: Response
  ) => {
    const { current_password, password } = request.body;
    const user = await User.findById(request.user.id);
    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );
    if (!isPasswordCorrect) {
      return response.status(401).json({
        error: "La contraseña actual es incorrecta!",
      });
    }

    try {
      user.password = await hashPassword(password);
      await user.save();
      return response.send("Credenciales actualizadas");
    } catch (error) {
      return response.status(500).json({
        error: "Hubo un error en la cuenta!",
      });
    }
  };
}
