// Import required modules
const fs = require("fs");
const path = require("path");
const Student = require("../models/student");

// Controller function to generate and download a CSV report of all students and their interviews
module.exports.downloadCSVReport = async function (req, res) {
  try {
    // Fetch all students from the database
    const allStudents = await Student.find({});

    // Create the CSV report header with column names
    let report =
      "student Id, Student name,Student college, Student email, Student status, DSA Final Score, WebD Final Score, React Final Score, Interview date, Interview company, Interview result";
    
    // Loop through each student to gather their data and interviews
    for (let student of allStudents) {
      // Gather basic student data
      let studentData1 =
        student.id +
        "," +
        student.name +
        "," +
        student.college +
        "," +
        student.email +
        "," +
        student.placement_status +
        "," +
        student.dsa_score +
        "," +
        student.webdev_score +
        "," +
        student.react_score;
      
      // Check if the student has any interviews
      if (student.interviews.length > 0) {
        // Loop through each interview of the student
        for (let interview of student.interviews) {
          let studentData2 = "";
          
          // Add interview-specific data to the studentData2 string
          studentData2 +=
            "," +
            interview.date.toString() +
            "," +
            interview.company +
            "," +
            interview.result;
          
          // Append studentData1 and studentData2 to the CSV report, separated by a new line
          report += "\n" + studentData1 + studentData2;
        }
      }
    }

    // Generate the CSV file and save it in the "uploads" folder
    fs.writeFile("uploads/studentsReport.csv", report, function (err, data) {
      if (err) {
        console.log(err);
        return res.redirect("back"); // If there's an error, redirect the user back to the previous page
      }

      // If the file is successfully generated, trigger a download of the CSV file to the client
      return res.download("uploads/studentsReport.csv");
    });
  } catch (err) {
    console.log(err); // Log any errors that occur during the process
  }
};
