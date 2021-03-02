const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * creates database format for movie collection
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: String,
    Death: String
  },
  ImagePath: String,
  Featured: Boolean
});

/**
 * creates database format for user collection
 */
let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  favoriteMovie: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }]
});

/**
 * hashes user password to be stored in the database
 * @param password
 */
userSchema.statics.hashPassword = password => {
  return bcrypt.hashSync(password, 10);
};

/**
 * compares user's login password with the hashed stored password
 * @param password
 */
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
