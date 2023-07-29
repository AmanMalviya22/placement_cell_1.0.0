const express = require("express");
const router = express.Router();
const {
  addStudent,
  update,
  editStudent,
  create,
  destroy,
} = require("../controllers/studentController");

// creating a new Student
router.post("/create", create);

// render edit page
router.get("/edit-student/:id", editStudent);

// updating  student
router.post("/update/:id", update);

// rending add  Student page
router.get("/add-student", addStudent);

// deleting student
router.get("/destroy/:studentId", destroy);

module.exports = router;
