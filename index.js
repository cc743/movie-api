const express = require("express");
const app = express();

let topMovies = [
  {
    title: "Once Upon a Time in Hollywood",
    director: "Quentin Tarantino"
  },
  {
    title: "Parasite",
    director: "Bong Joon-Ho"
  },
  {
    title: "The Mask",
    director: "Charles Russell"
  },
  {
    title: "A Fistful of Dollars",
    director: "Sergio Leone"
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan" //start with 5 movies for now
  }
];

app.get("/", (req, res) => {
  res.send("Welcome to my movie club");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.use(express.static("public"));

//listen for requests
app.listen(8080, () => console.log("Your app is listening on port 8080."));
