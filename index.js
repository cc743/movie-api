const express = require("express");
const morgan = require("morgan"); //locally importing Morgan
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

app.use(morgan("common")); //invoking Morgan

app.get("/", (req, res) => {
  res.send("Welcome to my movie club");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.use("/documentation.html", express.static("public")); //express.static()

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error! Error!");
});

//listen for requests
app.listen(8080, () => console.log("Your app is listening on port 8080."));
