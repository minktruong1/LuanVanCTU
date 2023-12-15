const express = require("express");
const colors = require("colors");
require("dotenv").config();
const dbConnect = require("./config/db.js");
const initRoutes = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://mern-frontend-silk.vercel.app/",
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
const port = process.env.PORT;
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
