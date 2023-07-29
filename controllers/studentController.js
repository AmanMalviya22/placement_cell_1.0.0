// Import required models
const Interview = require("../models/interview");
const Student = require("../models/student");

// Controller function to render the "add_student" page
module.exports.addStudent = (req, res) => {
  // Check if the user is authenticated (logged in)
  if (req.isAuthenticated()) {
    // If authenticated, render the "add_student" view with the title "Add Student"
    return res.render("add_student", {
      title: "Add Student",
    });
  }

  // If not authenticated, redirect the user to the home page (login page or similar)
  return res.redirect("/");
};

// Controller function to render the "edit_student" page
module.exports.editStudent = async (req, res) => {
  // Find the student document based on the provided student ID in the request parameters
  const student = await Student.findById(req.params.id);

  // Check if the user is authenticated (logged in)
  if (req.isAuthenticated()) {
    // If authenticated, render the "edit_student" view with the title "Edit Student" and pass the student details to the view
    return res.render("edit_student", {
      title: "Edit Student",
      student_details: student,
    });
  }

  // If not authenticated, redirect the user to the home page (login page or similar)
  return res.redirect("/");
};

// Controller function to create a new student
module.exports.create = async (req, res) => {
  try {
    // Extract student data from the request body
    const {
      name,
      email,
      batch,
      college,
      placementStatus,
      dsa_score,
      react_score,
      webdev_score,
    } = req.body;

    // Check if a student with the provided email already exists in the database
    Student.findOne({ email }, async (err, student) => {
      if (err) {
        console.log("error in finding student");
        return;
      }

      // If the student with the provided email does not exist, create a new student document in the database with the provided data
      if (!student) {
        await Student.create(
          {
            name,
            email,
            college,
            batch,
            dsa_score,
            react_score,
            webdev_score,
            placementStatus,
          },
          (err, student) => {
            if (err) {
              return res.redirect("back");
            }
            return res.redirect("back"); // After successfully creating the student, redirect the user back to the previous page
          }
        );
      } else {
        return res.redirect("back"); // If a student with the provided email already exists, redirect the user back to the previous page
      }
    });
  } catch (err) {
    console.log(err); // Log any errors that occur during the process
  }
};

// Controller function to delete a student
module.exports.destroy = async (req, res) => {
  try {
    // Extract "studentId" from the request parameters
    const { studentId } = req.params;

    // Find the student document based on the provided student ID
    const student = await Student.findById(studentId);

    // If the student is not found, return without doing anything
    if (!student) {
      return;
    }

    // Get the interviews associated with the student
    const interviewsOfStudent = student.interviews;

    // Delete references of the student from companies in which this student is enrolled
    if (interviewsOfStudent.length > 0) {
      for (let interview of interviewsOfStudent) {
        await Interview.findOneAndUpdate(
          { company: interview.company },
          { $pull: { students: { student: studentId } } }
        );
      }
    }

    // Remove the student from the database
    student.remove();

    return res.redirect("back"); // After successful deletion, redirect the user back to the previous page
  } catch (err) {
    console.log("error", err); // Log any errors that occur during the process
    return;
  }
};

// Controller function to update student details
module.exports.update = async (req, res) => {
  try {
    // Find the student document based on the provided student ID in the request parameters
    const student = await Student.findById(req.params.id);

    // Extract updated student data from the request body
    const {
      name,
      college,
      batch,
      dsa_score,
      react_score,
      webdev_score,
      placementStatus,
    } = req.body;

    // If the student is not found, redirect the user back to the previous page
    if (!student) {
      return res.redirect("back");
    }

    // Update the student's data with the new values
    student.name = name;
    student.college = college;
    student.batch = batch;
    student.dsa_score = dsa_score;
    student.react_score = react_score;
    student.webdev_score = webdev_score;
    student.placementStatus = placementStatus;

    // Save the updated student document to the database
    student.save();

    return res.redirect("/dashboard"); // After successful update, redirect the user to the dashboard page
  } catch (err) {
    console.log(err); // Log any errors that occur during the process
    return res.redirect("back"); // If there's an error, redirect the user back to the previous page
  }
};
