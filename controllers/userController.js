// Import required model
const User = require("../models/user");

// Controller function to render the user's profile page
module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "User Profile",
    profile_user: req.user, // Pass the logged-in user's data to the view
  });
};

// Controller function to update user details
module.exports.updateUser = async function (req, res) {
  try {
    // Find the user document based on the logged-in user's ID
    const user = await User.findById(req.user.id);

    // Extract updated user data from the request body
    const { username, password, confirm_password } = req.body;

    // Check if the provided password and confirm_password match
    if (password != confirm_password) {
      return res.redirect("back"); // If the passwords do not match, redirect the user back to the previous page
    }

    // If the user is not found, redirect the user back to the previous page
    if (!user) {
      return res.redirect("back");
    }

    // Update the user's username and password with the new values
    user.username = username;
    user.password = password;

    // Save the updated user document to the database
    user.save();

    return res.redirect("back"); // After successful update, redirect the user back to the previous page
  } catch (err) {
    console.log(err); // Log any errors that occur during the process
    return res.redirect("back"); // If there's an error, redirect the user back to the previous page
  }
};

// Controller function to render the "Sign In" page
module.exports.signIn = (req, res) => {
  // If the user is already authenticated (logged in), redirect the user to the profile page
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }

  // If the user is not authenticated, render the "signin.ejs" view
  return res.render("signin.ejs");
};

// Controller function to render the "Sign Up" page
module.exports.signUp = (req, res) => {
  // If the user is already authenticated (logged in), redirect the user to the profile page
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }

  // If the user is not authenticated, render the "signup.ejs" view
  return res.render("signup.ejs");
};

// Controller function to create a new user (Sign Up)
module.exports.create = async (req, res) => {
  try {
    // Extract user data from the request body
    const { username, email, password, confirm_password } = req.body;

    // Check if the provided password and confirm_password match
    if (password != confirm_password) {
      return res.redirect("back"); // If the passwords do not match, redirect the user back to the previous page
    }

    // Check if a user with the provided email already exists in the database
    User.findOne({ email }, async (err, user) => {
      if (err) {
        console.log("Error in finding user in signing up");
        return;
      }

      // If a user with the provided email does not exist, create a new user document in the database with the provided data
      if (!user) {
        await User.create(
          {
            email,
            password,
            username,
          },
          (err, user) => {
            if (err) {
              console.log("error", "Couldn't sign Up");
            }
            return res.redirect("/"); // After successful sign-up, redirect the user to the home page
          }
        );
      } else {
        console.log("error", "Email already registered!");
        return res.redirect("back"); // If a user with the provided email already exists, redirect the user back to the previous page
      }
    });
  } catch (err) {
    console.log(err); // Log any errors that occur during the process
  }
};

// Controller function to sign in and create a session for the user
module.exports.createSession = (req, res) => {
  return res.redirect("/dashboard"); // After successful sign-in, redirect the user to the dashboard page
};

// Controller function to clear the cookie and log the user out (destroy the session)
module.exports.destroySession = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err); // If there's an error during logout, call the next middleware with the error
    }
    return res.redirect("/"); // After successful logout, redirect the user to the home page
  });
};
