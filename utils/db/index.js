const mongoose = require("mongoose");
const config = require("../config");

let env = process.env.NODE_ENV || "dev";

var DB_URL;

switch (env) {
  case "dev":
    DB_URL = config.development.database_url;
    break;
  case "production":
    DB_URL = config.production.database_url;
    break;
  case "test":
    DB_URL = config.test.database_url;
    break;
}

async function connection() {
  try {
    await mongoose.connect(
      DB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      (error) => {
        if (error) return new Error("Failed to connect to database");
        console.log("connected");
      }
    );
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  connection,
};
