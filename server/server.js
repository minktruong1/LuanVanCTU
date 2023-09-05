const express = require("express");
const colors = require("colors");
require("dotenv").config();
const dbConnect = require("./config/db.js");
const initRoutes = require("./routes/index.js");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 8888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//database config
dbConnect();

initRoutes(app);

app.use("/", (req, res) => {
  res.send(`Server running`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`.bgGreen.white);
});
