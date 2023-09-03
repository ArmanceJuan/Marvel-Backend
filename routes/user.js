const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (username) {
      const user = await User.findOne({ email });
      if (user === null) {
        const token = uid2(64);
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);
        const newUser = new User({
          email: email,
          username: username,
          token: token,
          salt: salt,
          hash: hash,
        });
        await newUser.save();
        res.status(200).json({
          username: newUser.username,
          _id: newUser._id,
          token: newUser.token,
        });
      } else {
        res.status(409).json({ error: "Email already used" });
      }
    } else {
      res.status(400).json({ error: "Username is missing" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const newHash = SHA256(req.body.password + user.salt).toString(encBase64);
      if (newHash === user.hash) {
        res.json({
          _id: user._id,
          token: user.token,
          username: user.username,
        });
      } else {
        res.status(400).json({ error: "Unautorized" });
      }
    } else {
      res.status(400).json({ error: "Unautorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
