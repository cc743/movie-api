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
const Users = Models.User; //comment

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ingfg.mongodb.net/myFlixDB?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "myFlixDB"
  }
);

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

//Allow new users to register
app.post(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then(user => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthdate: req.body.Birthdate
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
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email
          // Birthdate: req.body.Birthdate
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

//Allow users to add a movie to list of favourite movies
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID }
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

//Allow users to remove a movie from list of favourite Movies
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
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
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(user => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted");
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
app.listen(8080, () => console.log("Your app is listening on port 8080."));
