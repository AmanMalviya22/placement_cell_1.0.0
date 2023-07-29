//requiring mongoose package
const mongoose = require("mongoose");

//creating interview schema
const interviewSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
   
    students: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        date: {
            type: String,
            required: true,
          },
        result: {
          type: String,
          enum: ["PASS", "FAIL", "Didn't Attempt", "On Hold"],
        },
      },
    ],
  },
  {
    // for adding time when content updated
    timestamps: true,
  }
);
// creating model for interview
const Interview = new mongoose.model("Interview", interviewSchema);
// exporting interview schema
module.exports = Interview;
