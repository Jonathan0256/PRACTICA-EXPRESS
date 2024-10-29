import express from "express";
import videogames from "./videogames.json" assert { type: "json" };

const PORT = 3000;
const app = express();

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

app.get("/search", (req, res) => {
  const platform = req.query.platform;
  const multiplayer = req.query.multiplayer === "true";
  const decade = req.query.decade;

  if (!decade) {
    return res.status(400).json({ error: "La dècada no pot estar buida!" });
  }

  const filteredVideogames = videogames.videogames.filter((videogame) => {
    const platformsArray = videogame.platform
      .split(", ")
      .map((platform) => platform.replace(/\s/g, ""));

    const gameDecade = Math.floor(videogame.releaseYear / 10) * 10;

    const platformMatch = !platform || platformsArray.includes(platform);
    const multiplayerMatch =
      !req.query.multiplayer || videogame.multiplayer === multiplayer;

    const decadeMatch = gameDecade.toString() === decade;

    return platformMatch && multiplayerMatch && decadeMatch;
  });

  res.json(filteredVideogames);
});

app.use((err, res) => {
  console.error(err.stack);
  res.status(500).send("Hi ha hagut un error!");
});

app.listen(PORT, () => {
  console.log("App running on port: ", PORT);
  console.log(`URL: http://localhost:${PORT}/`);
});
