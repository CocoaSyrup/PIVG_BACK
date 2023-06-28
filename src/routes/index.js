const router = require("express").Router();

const {
  getGamesHandler,
  getDetailHandler,
  getGenresHandler,
  getPlatformsHandler,
  postGameHandler,
  //deleteGameHandler,
} = require("./handlers");

router.get("/videogames", getGamesHandler);
router.get("/videogames/:id", getDetailHandler);
router.get("/genres", getGenresHandler);
router.get("/platforms", getPlatformsHandler);
router.post("/videogames", postGameHandler);


module.exports = router;



