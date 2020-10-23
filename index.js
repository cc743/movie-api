const express = require("express");
const morgan = require("morgan"); //locally importing Morgan
const bodyParser = require("body-parser");
// const uuid = require("uuid");
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
    director: "Andy Muschietti"
  },
  {
    title: "Taxi Driver",
    genre: "drama",
    director: "Martin Scorsese" //7 movies for now
  }
];

let users = [
  {
    name: "Carlos Flores",
    favgenre: "comedy"
  },
  {
    name: "Ann Jones",
    favGenre: "drama"
  }
];

app.use(morgan("common")); //invoking Morgan

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to my movie club");
});

//Get a list of all movies
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

//Gets data for a single movie by film's tilte
app.get("/movies/:title", (req, res) => {
  res.json(
    topMovies.find(movie => {
      return movie.title === req.params.title;
    })
  );
});

//Return data about a genre of a movie by its genre name (i.e. Horror)
app.get("/movies/Genres/:Name", (req, res) => {
  res.send("Successful GET request for returning data about a specific genre");
});

//Return data about a director by the director's name (i.e. Martin Scorsese)
app.get("/movies/Directors/:Name", (req, res) => {
  res.send("Successful GET request for returning data about a director");
});

//Allow new users to register
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = "Missing name in request body";
    res.status(400).send(message);
  } else {
    // newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

//Allow users to update their registration information
app.put("/users/:Username", (req, res) => {
  res.send("Successful PUT request for updating a user's information");
});

//Allow users to add a movie to list of favourite movies
app.post("/users/:Username/Movies/:MovieID", (req, res) => {
  res.send("Successful POST request for adding a movie to list of favourites");
});

//Allow users to remove a movie from list of favourite Movies
app.delete("/users/:Username/Movies/:MovieID", (req, res) => {
  res.send(
    "Successful DELETE request for removing a film from list of favourites"
  );
});

//Allow an existing user to de-register
app.delete("/users/:Username", (req, res) => {
  res.send(
    "Successful DELETE request for deleting an existing user from list of users"
  );
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
