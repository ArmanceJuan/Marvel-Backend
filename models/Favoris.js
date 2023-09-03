const mongoose = require("mongoose");

const userFavoris = mongoose.Schema({
  image: String,
  name: String,
  id: String,
});

const Favoris = mongoose.model("Favoris", userFavoris);

module.exports = Favoris;
