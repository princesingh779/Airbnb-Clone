const Home = require("../models/home");
const cloudinary = require("../utils/cloudnaryutils");

exports.homeList = (req, res) => {
  Home.find().then((homeDetails) => {
    res.render("host/host-home-list", {
      homeDetails,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.homeAddForm = (req, res) => {
  res.render("host/edit-home", {
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddHome = async (req, res) => {
  try {
    const uploadImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      uploadImages.push(result.secure_url);
    }

    if (uploadImages.length === 0) {
      return res.status(400).send("File not uploaded");
    }

    const { location, price, date, rating, description } = req.body;
    const currdate = new Date(date).toISOString().slice(0, 10);
    const home = new Home({
      photos: uploadImages,
      location,
      currdate,
      price,
      rating,
      description,
      isfavourite: false,
    });

    await home.save();

    Home.find().then((homeDetails) => {
      res.render("host/host-home-list", {
        homeDetails,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    });
  } catch (error) {
    console.log("Error is found : ", error);
  }
};

exports.postEditHome = async (req, res) => {
  console.log("i am in postEditHome");
  // console.log("The id of the editing house is :", req.body._id);
  // const homeId = req.body.id;
  let photo;
  if (req.file) {
    console.log(req.file.path);
    const result = await cloudinary.uploader.upload(req.file.path);

    photo = result.secure_url;
    if (!photo) {
      return res.status(400).send("File not uploaded");
    }
  } else {
    photo = req.body.existingImage;
  }

  const { _id, location, date, price, rating, description, isfavourite } =
    req.body;

  Home.findById(_id)
    .then((home) => {
      home.photo = photo;
      home.date = date;
      home.location = location;
      home.price = price;
      home.rating = rating;
      home.description = description;
      home.isfavourite = isfavourite;
      home
        .save()
        .then((result) => {
          console.log("Home Updated : ", result);
        })
        .catch((err) => {
          console.log("Error while Updating :", err);
        });

      res.redirect("/host-homes");
    })
    .catch((err) => {
      console.log("Error while finding the home : ", err);
    });
};

exports.getEditHome = (req, res) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  Home.findById(homeId)
    .then((home) => {
      console.log("The getting home is : ", home);
      res.render("host/edit-home", {
        editing: editing,
        home: home,
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((error) => {
      console.log("Error is found : ", error);
      res.redirect("/host-homes");
    });
};

exports.postDeleteHome = (req, res) => {
  console.log("hello i am from host home:");
  const homeId = req.params.homeId;
  console.log("house to delete from host page", homeId);
  Home.findOneAndDelete({ _id: homeId })
    .then(() => {
      res.redirect("/host-homes");
    })
    .catch((err) => {
      console.log("Error while deleting : ", err);
    });
};
