import app from "./server";
import colors from "colors";

const port = process.env.PORT || 4000;

// Levantamos el servidor
app.listen(port, () => {
  console.log(colors.cyan.bold(`REST API Enabled in port ${port}`));
});