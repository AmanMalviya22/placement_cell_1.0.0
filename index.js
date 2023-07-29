const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000;
const app = express();
const db = require("./config/mongoose");
app.listen(port, function (err) {
  if (err) {
    console.log("err in listening");
    return;
  }
  console.log("server is listening on port ", port);
});
