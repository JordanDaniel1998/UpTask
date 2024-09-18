import express from "express";
import dotenv from "dotenv";
import { connectToMongooseDatabase } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import { corsConfig } from "./config/cors";
import morgan from "morgan";

// Habilitamos las variables de entorno
dotenv.config();

// Connectar a Moongose
connectToMongooseDatabase();

const app = express();

// Habilitar CORS
app.use(cors(corsConfig));
// Logging
app.use(morgan("dev"));
// Habilitamos la lectura de json
app.use(express.json());
// Vinculamos las rutas de nuestro proyecto
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

export default app;
