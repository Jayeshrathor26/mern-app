const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
dotenv.config({ path: "./config.env" });
require("./database/db");
const user = require("./models/userschema");
app.use(express.json());
app.use(require("./router/auth"));

app.get("/", (req, res) => {
  res.send("hello wolrd from app. get");
});

app.listen(8000, () => {
  console.log("server is runing");
});
