const express = require("express");

const {
  homeAddForm,
  homeList,
  postAddHome,
  getEditHome,
  postEditHome,
  postDeleteHome,
} = require("../controllers/hostController");

const { upload } = require("../middlewares/multer.middleware");
const hostRouter = express.Router();

hostRouter.get("/host-homes", homeList);
hostRouter.get("/add-homes", homeAddForm);
hostRouter.post("/add-home", upload.array("photo", 5), postAddHome);
hostRouter.get("/edit-home/:homeId", getEditHome);
hostRouter.post("/edit-home", upload.single("photo"), postEditHome);
hostRouter.post("/host/delete-home/:homeId", postDeleteHome);

module.exports = hostRouter;
