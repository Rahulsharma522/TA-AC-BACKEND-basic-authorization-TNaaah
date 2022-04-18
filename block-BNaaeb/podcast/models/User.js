var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (this.email === 'helloAdmin@gmail.com') {
    this.isAdmin === true;
  }
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    return next();
  }
});
userSchema.methods.verifyPassword = function (password, cd) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cd(err, result);
  });
};

var User = mongoose.model('User', userSchema);
module.exports = User;