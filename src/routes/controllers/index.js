const axios = require("axios");
const { Op } = require("sequelize");
const { Genre, Videogame, Platform } = require("../../db");
const { API_KEY, API } = process.env;

const GetGamesByName = async (name) => {
  let nmGameDB = await Videogame.findAll({
    where: { name: { [Op.iLike]: name } },
    include: Genre,
  });
  let nmGameAPI = await apiRequest("games", `&search=${name}`);
  nmGameDB = nmGameDB?.map((gm) => formatGame(gm)) || [];
  nmGameAPI = nmGameAPI.results?.map((gm) => formatGame(gm)) || [];
  const nmGames = nmGameDB.concat(...nmGameAPI).slice(0, 15);
  return nmGames.length ? nmGames : null;
};

const GetGameById = async (id) => {
  let idGame;
  if (isNaN(id)) {
    idGame = await Videogame.findByPk(id, { include: Genre });
  } else {
    idGame = await apiRequest(`games/${id}`);
  }
  return idGame ? formatGame(idGame, isNaN(id)) : null;
};

const GetAllGames = async () => {
  let gmsDB = await Videogame.findAll({ include: Genre });
  gmsDB = gmsDB?.map((gm) => formatGame(gm)) || [];
  let gmsAPI = [];
  for (let i = 1; i < 6; i++) {
    const gms = await apiRequest("games", `&page=${i}`);
    gmsAPI.push(gms.results?.map((gm) => formatGame(gm))) || [];
  }
  const allGames = gmsDB.concat(...gmsAPI);
  return allGames ? allGames : null;
};

const GetGenres = async () => {
  let gmGenres = await apiRequest("genres");
  gmGenres = gmGenres.results?.map((genre) => genre.name);
  await Genre.bulkCreate(
    gmGenres?.map((name) => ({ name })),
    { ignoreDuplicates: true }
  );
  return gmGenres ? gmGenres : null;
};

const GetPlatforms = async () => {
  let gmPlatforms = await apiRequest("platforms");
  gmPlatforms = gmPlatforms.results?.map((platform) => platform.name);
  return gmPlatforms ? gmPlatforms : null;
};

const PostCreatedGame = async (gm) => {
  const newGame = await Videogame.create({
    name: gm.name,
    image: gm.image,
    platform: gm.platforms,
    description: gm.description,
    released: gm.released,
    rating: gm.rating,
  });
  await newGame.addGenre(gm.genre);
  gm.id = newGame.id;
  return gm;
};



const apiRequest = async (rsc, url = "") => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API}${rsc}${API_KEY}${url}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const formatGame = (gm) => ({
  id: gm.id,
  name: gm.name,
  image: gm.image ?? gm.background_image,
  platform: gm.platform ?? gm.platforms?.map((p) => p.platform?.name) ?? [],
  description: gm.description ?? gm.description_raw ?? "",
  released: gm.released ?? "",
  rating: gm.rating ?? "",
  genre: gm.Genres?.map((g) => g.name) ?? gm.genres?.map((g) => g.name),
});

module.exports = {
  GetGamesByName,
  GetGameById,
  GetAllGames,
  GetGenres,
  GetPlatforms,
  PostCreatedGame,
  //DeleteGame,
};
