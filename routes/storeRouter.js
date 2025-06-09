const express = require("express");

const {
  homeMain,
  getbookings,
  getIndex,
  getHomeDetails,
  addToFavourites,
  getFavouriteList,
  deleteFavourites,
} = require("../controllers/storeController");

const StoreRouter = express.Router();

StoreRouter.get("/", homeMain);
StoreRouter.get("/bookings", getbookings);
StoreRouter.get("/index", getIndex);
StoreRouter.get("/home/:homeId", getHomeDetails);
StoreRouter.post("/favourites", addToFavourites);
StoreRouter.get("/favourites", getFavouriteList);
StoreRouter.post("/favourites/delete/:homeId", deleteFavourites);

module.exports = StoreRouter;
