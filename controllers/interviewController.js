// Import required models
const Interview = require("../models/interview");
const Student = require("../models/student");


// Controller function to create a new interview
module.exports.create = async (req, res) => {
    try {
      // Extract "company" and "date" from the request body
      const { company, date } = req.body;
  
      // Create a new interview document in the database with the provided "company" and "date"
      await Interview.create(
        {
          company,
          date,
        },
        (err, Interview) => {
          if (err) {
            return res.redirect("back"); // If an error occurs, redirect the user back to the previous page
          }
          return res.redirect("back"); // After successfully creating the interview, redirect the user back to the previous page
        }
      );
    } catch (err) {
      console.log(err); // Log any errors that occur during the process
    }
  };

// Controller function to render the "addInterview" page
module.exports.addInterview = (req, res) => {
  // Check if the user is authenticated (logged in)
  if (req.isAuthenticated()) {
    // If authenticated, render the "add_interview" view with the title "Schedule An Interview"
    return res.render("add_interview", {
      title: "Schedule An Interview",
    });
  }

  // If not authenticated, redirect the user to the home page (login page or similar)
  return res.redirect("/");
};


// Controller function to deallocate a student from an interview
module.exports.deallocate = async (req, res) => {
    try {
      // Extract "studentId" and "interviewId" from the request parameters
      const { studentId, interviewId } = req.params;
  
      // Find the interview document based on the provided interview ID
      const interview = await Interview.findById(interviewId);
  
      if (interview) {
        // Remove the reference of the student from the "students" field of the interview schema
        await Interview.findOneAndUpdate(
          { _id: interviewId },
          { $pull: { students: { student: studentId } } }
        );
  
        // Remove the interview from the student's schema using the interview's company
        await Student.findOneAndUpdate(
          { _id: studentId },
          { $pull: { interviews: { company: interview.company } } }
        );
  
        return res.redirect("back"); // After successful deallocation, redirect the user back to the previous page
      }
      return res.redirect("back"); // If the interview with the provided ID is not found, redirect the user back to the previous page
    } catch (err) {
      console.log("error", "Couldn't deallocate from interview");
    }
  };

// Controller function to enroll a student in an interview
module.exports.enrollInInterview = async (req, res) => {
  try {
    // Find the interview document based on the provided interview ID in the request parameters
    let interview = await Interview.findById(req.params.id);

    // Extract "email" and "result" from the request body
    const { email, result } = req.body;

    if (interview) {
      // Find the student document with the provided email
      let student = await Student.findOne({ email: email });

      if (student) {
        // Check if the student is already enrolled in any interview
        let alreadyEnrolled = await Interview.findOne({
          "students.student": student.id,
        });

        // Prevent the student from enrolling in the same company's interview more than once
        if (alreadyEnrolled && alreadyEnrolled.company === interview.company) {
          req.flash(
            "error",
            `${student.name} already enrolled in ${interview.company} interview!`
          );
          return res.redirect("back");
        }

        // Create a student object with the student ID and the provided result
        let studentObj = {
          student: student.id,
          result: result,
        };

        // Update the "students" field of the interview by adding the reference of the newly enrolled student
        await interview.updateOne({
          $push: { students: studentObj },
        });

        // Update the student's "interviews" field with the details of the assigned interview
        let assignedInterview = {
          company: interview.company,
          date: interview.date,
          result: result,
        };
        await student.updateOne({
          $push: { interviews: assignedInterview },
        });

        console.log(
          "success",
          `${student.name} enrolled in ${interview.company} interview!`
        );
        return res.redirect("back"); // After successful enrollment, redirect the user back to the previous page
      }
      return res.redirect("back"); // If the student with the provided email is not found, redirect the user back to the previous page
    }
    return res.redirect("back"); // If the interview with the provided ID is not found, redirect the user back to the previous page
  } catch (err) {
    console.log("error", "Error in enrolling interview!");
  }
};


