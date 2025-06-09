const express = require("express");
const controllers = require("./controllers/errors");
const app = express();
const mongoose = require("mongoose");
// Middleware to parse upcoming request
const hostRouter = require("./routes/hostRouter");
const storeRouter = require("./routes/storeRouter");
const authRouter = require("./routes/authRouter");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const DB_PATH =
  "mongodb+srv://princesingh202002:EzZjOGyodZgDVyJX@airbnbproject.pslrcna.mongodb.net/airbnbproject?retryWrites=true&w=majority&appName=airbnbproject";
const PORT = 3004;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

app.use(
  session({
    secret: "akdfdsjfkldsfdshfjdsjf",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use("/", (req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});
app.use("/auth/", authRouter);

app.use("/", hostRouter);

app.use("/", storeRouter);

app.use(controllers.notFound);

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to Mongo");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on address http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to mongo", err);
  });
