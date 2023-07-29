// requiring mongoose package
const mongoose = require("mongoose");

// creating user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    //added to see when database updated
    timestamps: true,
  }
);

// validate the password with passed on user password
userSchema.methods.isValidatePassword = async function (userSentPassword) {
  return this.password === userSentPassword;
};


// creating user model
const User = new mongoose.model("User", userSchema);

// exporting user model
module.exports = User;
