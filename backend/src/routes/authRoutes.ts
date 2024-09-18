import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

// Crear la cuenta
router.post(
  "/create-account",
  body("name").notEmpty().withMessage("Nombre del Usuario es obligatorio!"),
  body("email")
    .notEmpty()
    .withMessage("Email del Usuario es obligatorio!")
    .isEmail()
    .withMessage("E-mail no válido!"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria!")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta, mínimo 8 carácteres!"),
  body("password_confirmation")
    .notEmpty()
    .withMessage("La contraseña es obligatoria!")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta, mínimo 8 carácteres!")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        // Los errores personalizados también son capturados por express-validation
        throw new Error("Las contraseñas no coinciden!");
      }
      // Permite que continue al siguiente middleware
      return true;
    }),
  handleInputErrors,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El Token es obligatorio!"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email")
    .notEmpty()
    .withMessage("Email del Usuario es obligatorio!")
    .isEmail()
    .withMessage("E-mail no válido!"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria!"),
  handleInputErrors,
  AuthController.login
);

router.post(
  "/request-code",
  body("email")
    .notEmpty()
    .withMessage("Email del Usuario es obligatorio!")
    .isEmail()
    .withMessage("E-mail no válido!"),
  handleInputErrors,
  AuthController.requestConfirmationCode
);

router.post(
  "/forgot-password",
  body("email")
    .notEmpty()
    .withMessage("Email del Usuario es obligatorio!")
    .isEmail()
    .withMessage("E-mail no válido!"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El Token es obligatorio!"),
  handleInputErrors,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Token no válido!"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria!")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta, mínimo 8 carácteres!"),
  body("password_confirmation")
    .notEmpty()
    .withMessage("La contraseña es obligatoria!")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta, mínimo 8 carácteres!")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        // Los errores personalizados también son capturados por express-validation
        throw new Error("Las contraseñas no coinciden!");
      }
      // Permite que continue al siguiente middleware
      return true;
    }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

router.get("/user", authenticate, AuthController.user);
export default router;
