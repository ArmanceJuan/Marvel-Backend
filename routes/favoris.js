const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();
const MarvelUser = require("../models/User");

router.post("/favoris/:id", isAuthenticated, async (req, res) => {
  try {
    const ficheId = req.params.id;
    const userId = req.user._id;

    const user = await MarvelUser.findById(userId);
    if (user.favoris.includes(ficheId)) {
      return res.status(400).json({ message: "Fiche déjà ajouté" });
    }
    user.favoris.push(ficheId);
    await user.save();
    res.status(200).json({ message: "Fiche ajouté" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/favoris/user", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await MarvelUser.findById(userId).populate("favoris");
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.status(200).json(user.favoris);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
