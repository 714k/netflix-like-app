const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 12;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

UserSchema.pre('save', function(next) {
  let user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
    if(error) {
      return next(error);
    }

    bcrypt.hash(user.password, salt, (error, hash) => {
      if(error) {
        return next(error);
      }

      user.password = hash;
      next();
    });
  }); 
});

UserSchema.methods.comparePassword = (candidatePassword, cb) => {
  bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
    if(error) {
      return cb(error);
    }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);