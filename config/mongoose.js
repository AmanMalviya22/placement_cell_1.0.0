// require mongoose package
const mongoose = require("mongoose");
//require dotenv package to access .env file
require("dotenv").config();

// set strictquery to false
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

// checking if any  error
db.on(
  "error",
  console.error.bind(console, "error during connecting  to  database")
);

// if no error
db.once("open", () => {
  console.log(" connected to database");
});

// exporting  the db
module.exports = db;
