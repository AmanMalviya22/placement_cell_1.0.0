const passport = require("passport");
const express = require("express");
const { dashboard } = require("../controllers/dashboardController");
const { downloadCSVReport } = require("../controllers/reportController");

// requiring files
const {
  profile,
  updateUser,
  signIn,
  signUp,
  create,
  createSession,
  destroySession,
} = require("../controllers/userController");
const router = express.Router();
// route for dashboard
router.get("/dashboard", dashboard);

// router for sign in page
router.get("/", signIn);

// route for creating a new User
router.post("/create", create);

// route for logout button
router.get("/sign-out", destroySession);

// route for sign up page
router.get("/sign-up", signUp);

// router for checking up the profile
router.get("/profile", passport.checkAuthentication, profile);

//updating user profile
router.post("/update", passport.checkAuthentication, updateUser);

// route for downloading csv reports
router.get("/download", downloadCSVReport);

// use passport as middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/" }),
  createSession
);

module.exports = router;
