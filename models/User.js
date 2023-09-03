const mongoose = require("mongoose");

const MarvelUser = mongoose.model("MarvelUser", {
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  favoris: [{ type: mongoose.Schema.Types.ObjectId }],
  token: String,
  hash: String,
  salt: String,
});

module.exports = MarvelUser;
