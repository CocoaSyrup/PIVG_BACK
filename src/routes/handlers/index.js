const {
  GetGamesByName,
  GetGameById,
  GetAllGames,
  GetGenres,
  GetPlatforms,
  PostCreatedGame,
  DeleteGame,
} = require("../controllers");

const getGamesHandler = async (req, res) => {
  try {
    let foundVg;
    if (req.query.name) {
      foundVg = await GetGamesByName(req.query.name);
    } else foundVg = await GetAllGames();
    return foundVg
      ? res.status(200).json(foundVg)
      : res.status(404).send("El Videojuego no fue encontrado");
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getDetailHandler = async (req, res) => {
  try {
    const foundId = await GetGameById(req.params.id);
    return foundId
      ? res.status(200).json(foundId)
      : res.status(404).send("El Id no fue encontrado");
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getGenresHandler = async (req, res) => {
  try {
    const gmGenres = await GetGenres();
    return gmGenres
      ? res.status(200).json(gmGenres)
      : res.status(404).send("Videogame Genres could not be found");
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getPlatformsHandler = async (req, res) => {
  try {
    const gmPlatforms = await GetPlatforms();
    return gmPlatforms
      ? res.status(200).json(gmPlatforms)
      : res.status(404).send("Videogame Platforms could not be found");
  } catch (error) {
    return res.status(500).json(error);
  }
};

const postGameHandler = async (req, res) => {
  try {
    const newGame = await PostCreatedGame(req.body);
    return newGame
      ? res.status(200).json(newGame)
      : res.status(404).send("Videogame could not be created");
  } catch (error) {
    return res.status(500).json(error);
  }
};



module.exports = {
  getGamesHandler,
  getDetailHandler,
  getGenresHandler,
  getPlatformsHandler,
  postGameHandler,
  //deleteGameHandler,
};
