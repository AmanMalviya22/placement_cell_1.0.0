const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000;
const app = express();
const db = require("./config/mongoose");

app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

  // used for sessions
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport");

const mongoStore = require("connect-mongo");

app.use(cookieParser());

// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");



app.use(
    session({
      name: "placement_cell_1.0.0",
      secret: "Aman_Malviya",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 100,
      },
      store: MongoStore.create({
        mongoUrl:
        process.env.MONGO_URI,
        autoRemove: "disabled",
      }),
      function(err) {
        console.log(err || "connect-mongodb setup ok");
      },
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  

  // sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);

// using express routers
app.use(require("./routes"));

// using bodyParser
app.use(bodyParser.json());
  
app.listen(port, function (err) {
  if (err) {
    console.log("err in listening");
    return;
  }
  console.log("server is listening on port ", port);
});
