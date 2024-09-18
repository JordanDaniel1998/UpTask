import mongoose from "mongoose";
import colors from "colors";

export const connectToMongooseDatabase = async () => {
  try {
    const database = await mongoose.connect(process.env.DATABASE_MOONGOSE_URL);
    const urlString = `${database.connection.host}:${database.connection.port}`;
    console.log(
      colors.magenta.bold(`Mongo DB conectado a través de ${urlString}`)
    );
  } catch (error) {
    colors.magenta.bold(`Conexión fallida con Mongo DB`);
    process.exit(1);
  }
};
