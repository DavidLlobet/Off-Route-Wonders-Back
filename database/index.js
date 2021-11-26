const debug = require("debug")("places:database");
const chalk = require("chalk");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = (databaseString) =>
  new Promise((resolve, reject) => {
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret._v;
      },
    });
    mongoose.connect(databaseString, (error) => {
      if (error) {
        debug(chalk.red("No se ha podido iniciar la base de datos."));
        debug(chalk.red(error.message));
        reject();
        return;
      }
      debug(chalk.green("Conectado a la base de datos"));

      resolve();
    });
    mongoose.connection.on("close", () => {
      debug(chalk.green("Desconectado de la base de datos"));
    });
  });

module.exports = connectDB;
