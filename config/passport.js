// require necessary modules
const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

// Authentication using Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Specify that the "email" field will be used as the username
      passReqToCallback: true, // Allow passing the entire request to the callback function
    },
    async function (req, email, password, done) {
      // Find the user in the database based on the provided email
      User.findOne({ email: email }, async function (err, user) {
        if (err) {
          console.log("error in finding the user", err);
          return done(err);
        }
        if (!user) {
          console.log("Invalid UserName or Password");
          return done(null, false);
        }

        // Match the provided password with the hashed password in the database
        const isPasswordValid = await user.isValidatePassword(password);

        if (!isPasswordValid) {
          console.log("Invalid Username or Password");
          return done(null, false);
        }

        // If the user is found and the password is valid, return the user object
        // The user object will be available as "req.user" in subsequent requests
        return done(null, user);
      });
    }
  )
);

// Serializing the user to choose which key should be kept in cookies
passport.serializeUser(function (user, done) {
  return done(null, user.id); // Save the user ID in the session cookie
});

// Deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user ---> Passport");
      return done(err);
    }

    return done(null, user); // Retrieve the user object and attach it to "req.user"
  });
});

// Middleware to check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // If the user is signed in (authenticated), then pass on the request to the next function
  if (req.isAuthenticated()) {
    return next();
  }

  // If the user is not authenticated, redirect them to a login page or home page
  return res.redirect("/");
};

// Middleware to set the authenticated user in the response locals
passport.setAuthenticatedUser = function (req, res, next) {
  // If the user is authenticated, store the user object in res.locals
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
