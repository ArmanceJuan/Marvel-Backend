require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const userRoutes = require("./routes/user");
const favorisRoutes = require("./routes/favoris");

app.use(userRoutes);
app.use(favorisRoutes);

app.get("/comics/:skip", async (req, res) => {
  try {
    const title = req.params.title || "";
    const skip = req.params.skip;
    const limit = req.params.limit || 100;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}&title=${title}&skip=${skip}&limit=${limit}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.get("/characters/:skip", async (req, res) => {
  try {
    const name = req.params.name || "";
    const skip = req.params.skip || 0;
    const limit = req.params.limit || 100;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&name=${name}&skip=${skip}&limit=${limit}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.get("/comic/:comicId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${req.params.comicId}?apiKey=${process.env.API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/character/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
});

app.all("*", (req, res) => {
  return res.status(400).json({ message: "Jarvis can't access your request" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
