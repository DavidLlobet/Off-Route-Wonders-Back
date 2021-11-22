const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");
const debug = require("debug")("places:server");
const express = require("express");

const app = express();

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.yellow(`Escuchando en el puerto ${port}`));
      resolve(server);
    });
    server.on("error", (error) => {
      debug(chalk.red("Ha habido un error al iniciar el servidor."));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`El puerto ${port} está en uso.`));
      }
      reject();
    });
    server.on("close", () => {
      debug(chalk.yellow("Servidor express desconectado"));
    });
  });

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/places", placesRoutes);
app.use("/users", usersRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = { app, initializeServer };
