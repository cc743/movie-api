const express = require("express");
const morgan = require("morgan"); //locally importing Morgan
const bodyParser = require("body-parser");
const uuid = require("uuid");
const app = express();

let topMovies = [
  {
    title: "Once Upon a Time in Hollywood",
    genre: "comedy-drama",
    director: "Quentin Tarantino"
  },
  {
    title: "Parasite",
    genre: "thriller",
    director: "Bong Joon-Ho"
  },
  {
    title: "The Mask",
    genre: "comedy",
    director: "Charles Russell"
  },
  {
    title: "A Fistful of Dollars",
    genre: "western",
    director: "Sergio Leone"
  },
  {
    title: "The Dark Knight",
    genre: "superhero",
    director: "Christopher Nolan"
  },
  {
    title: "It",
    genre: "horror",
    director: "Andy Muschietti" //6 movies for now
  },
  {
    title: "Taxi Driver",
    genre: "drama",
    director: "Martin Scorsese"
  }
];

app.use(morgan("common")); //invoking Morgan

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to my movie club");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

//Gets data for a single student by film's tilte
app.get("/movies/:title", (req, res) => {
  res.json(
    topMovies.find(movie => {
      return movie.title === req.params.title;
    })
  );
});

//Allow new users to register
app.post("/users", (req, res) => {
  res.send("Successful POST request for registering a new user");
});

//Allow an existing user to de-register
app.delete("/users/:id", (req, res) => {
  res.send(
    "Successful DELETE request for deleting an existing user from list of users"
  );
});

//Allow users to update their registration information
app.put("/users/:id", (req, res) => {
  res.send("Successful PUT request for updating a user's information");
});

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
