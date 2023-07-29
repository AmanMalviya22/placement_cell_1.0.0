// Import required models
const Interview = require("../models/interview");
const Student = require("../models/student");

// Controller function to handle the dashboard route
module.exports.dashboard = async function (req, res) {
  try {
    // Check if the user is authenticated (logged in)
    if (req.isAuthenticated()) {
      // Fetch all students from the database and populate their "interviews" field with associated interviews
      let students = await Student.find({}).populate("interviews");

      // Fetch all interviews from the database and populate their "students" field with associated students
      let interviews = await Interview.find({}).populate("students.student");

      // Render the "dashboard" view and pass the fetched data to the view template
      return res.render("dashboard", {
        title: "Dashboard",
        all_students: students, // Pass the array of students with their interviews to the view
        all_interviews: interviews, // Pass the array of interviews with their associated students to the view
      });
    } else {
      // If the user is not authenticated, redirect them to the login page
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err); // Log any errors that occur during the process
    return res.redirect("back"); // Redirect the user back to the previous page in case of an error
  }
};
