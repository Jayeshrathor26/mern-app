const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("../database/db");
const user = require("../models/userschema");

router.get("/", (req, res) => {
  res.send("hello world from router");
});

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    const userExist = await user.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already registered" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "your cpassword not match" });
    } else {
      const userdata = new user({
        name,
        email,
        phone,
        work,
        password,
        cpassword,
      });

      await userdata.save();
      res.status(201).json({ message: "You are successfully registered" });
    }
  } catch (err) {
    console.error(err);
  }
});

router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Please fill all details" });

    const userlogin = await user.findOne({ email: email });

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
    });

    const ismatch = await bcrypt.compare(password, userlogin.password);

    token = await userlogin.generateAuthToken();

    if (!ismatch) {
      res.status(400).json({ error: "invalid details" });
    } else {
      res.json({ msg: "user login successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {});

module.exports = router;
