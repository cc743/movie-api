require("dotenv").config();

const express = require("express");
const morgan = require("morgan"); //locally importing Morgan
const bodyParser = require("body-parser");
// const uuid = require("uuid");
const app = express();

const passport = require("passport"); //requiring the Passport module and importing the passport.js file
require("./passport");

const mongoose = require("mongoose");
const Models = require("./model.js");

const Movies = Models.Movie;
const Users = Models.User;

//'mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ingfg.mongodb.net/myFlixDB?retryWrites=true&w=majority'
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "myFlixDB"
});

const cors = require("cors");
app.use(cors());
/*rest of code goes here*/

const { check, validationResult } = require("express-validator");

app.use(morgan("common")); //invoking Morgan

app.use(bodyParser.json());

let auth = require("./auth")(app); //making sure it is placed after bodyparser middleware function

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to my movie club!");
});

//Get a list of all movies to the user
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then(movies => {
        res.status(201).json(movies);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Gets data for a single movie by film's title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then(movie => {
        res.status(201).json(movie);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Return data about a genre by name (i.e. Western)
app.get(
  "/movies/Genres/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then(movie => {
        res.status(201).json(movie.Genre.Name + ": " + movie.Genre.Description);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Return data about a director by name (i.e. Martin Scrosese)
app.get(
  "/movies/Directors/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then(movie => {
        res.status(201).json(movie.Director.Name + ": " + movie.Director.Bio);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Get all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then(users => {
        res.status(201).json(users);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get a user by username
app.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ username: req.params.username })
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Allow new users to register
//Question: do I keep the part that says 'passport.authenticate("jwt", {session: false})' or no? - this comes from observing the reading
app.post(
  "/users",
  [
    check("username", "Username is required").isLength({ min: 5 }),
    check(
      "username",
      "Username contains non-alphanumeric characters - not allowed"
    ).isAlphanumeric(),
    check("password", "Password is required")
      .not()
      .isEmpty(),
    check("email", "Email does not appear to be valid").isEmail()
  ],
  (req, res) => {
    //check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
    Users.findOne({ username: req.body.username }) //search to see if a user with the requested username already exists
      .then(user => {
        if (user) {
          return res.status(400).send(req.body.username + " already exists");
        } else {
          Users.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
            // birthdate: req.body.birthdate
          })
            .then(user => {
              res.status(201).json(user);
            })
            .catch(err => {
              console.error(err);
              res.status(500).send("Error: " + err);
            });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Allow users to update their registration information
app.put(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  [
    check("username", "Username is required").isLength({ min: 5 }),
    check(
      "username",
      "Username contains non-alphanumeric characters - not allowed"
    ).isAlphanumeric(),
    check("password", "Password is required")
      .not()
      .isEmpty(),
    check("email", "Email does not appear to be valid").isEmail()
  ],
  (req, res) => {
    //check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
    Users.findOneAndUpdate(
      { username: req.params.username },
      {
        $set: {
          username: req.body.username,
          password: hashedPassword, //do i need to hash password here?
          email: req.body.email
          // birthdate: req.body.birthdate
        }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Allow users to add a movie to list of favourite movies (Note: a PUT request might be more appropriate)
app.post(
  "/users/:username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { username: req.params.username },
      {
        $push: { favoriteMovie: req.params.movieID }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.status(201).json(updatedUser);
        }
      }
    );
  }
);

//Allow users to remove a movie from list of favourite Movies (Note: a PUT request might be more appropriate)
app.delete(
  "/users/:username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { favoriteMovie: req.params.movieID } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Allow an existing user to de-register
app.delete(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ username: req.params.username })
      .then(user => {
        if (!user) {
          res.status(400).send(req.params.username + " was not found");
        } else {
          res.status(200).send(req.params.username + " was deleted");
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//using this piece of code instead of app.use(express.static('public')) due to technical difficulties
app.get("documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: _dirname });
});

//error handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error! Error!");
});

//listen for requests
//app.listen(8080, () => console.log("Your app is listening on port 8080."));
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
