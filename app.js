const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const passport = require("passport");

const throwError = require("./models/throwError");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(passport.initialize());
require("./models/passport")(passport);

app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  throw new throwError("Could not find that page", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || "An Unknown error occured",
    code: error.code || 500,
  });
});

// Connect to database and start the server
const port = process.env.port || 5000;
mongoose
  .connect(
    `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0-e25md.mongodb.net/travelgram?retryWrites=true&w=majority`,
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
  )
  .then(app.listen(port, () => console.log("started and connected to DB")))
  .catch((err) => console.log(err));
