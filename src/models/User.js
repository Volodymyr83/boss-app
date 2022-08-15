const { Schema, model } = require("mongoose");
const passHasher = require("../helpers/passHasher");
const { ADMIN, BOSS, REGULAR_USER } = require("../entities/roles");

const User = new Schema({
  role: {
    type: String,
    required: true,
    enum: [ADMIN, BOSS, REGULAR_USER],
  },
  boss_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  subordinates_ids: [String],  
  email: {
    type: String,
    unique: true,
    required: [true, "Email required"],
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      `Please fill in valid email address`,
    ],
  },
  password: {
    type: String,
    required: [true, "Password required"],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      `Passwords must contain:
        a minimum 1 lower case letter [a-z] and
        a minimum 1 upper case letter [A-Z] and
        a minimum 1 numeric character [0-9] and
        must be at least 8 characters long`,
    ],
  },  
});

User.pre('save', async function(next) {
	const user = this;

	// only hash the password if it has been modified (or it's new)
	if (!user.isModified('password')) {
		return next();
	}
  
  user.password = await passHasher(user.password); 
  next();
});

module.exports = model("User", User);
