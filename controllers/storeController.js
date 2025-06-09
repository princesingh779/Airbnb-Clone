const Home = require("../models/home");
const user = require("../models/user");

// exports.homeMain = (req, res) => {
//   Home.find()
//     .then((homeDetails) => {
//       res.render("store/home-list", {
//         homeDetails,
//         isLoggedIn: req.isLoggedIn,
//         user: req.session.user,
//       });
//     })
//     .catch((error) => {
//       console.log("The data is not found : ", error);
//     });
// };

exports.homeMain = async (req, res) => {
  try {
    const homeDetails = await Home.find();
    const userId = req.session.user?._id;

    let favouriteIds = [];
    if (userId) {
      const User = await user.findById(userId);
      favouriteIds = User.favourites.map((fav) => fav.toString());
    }

    // Add isFavourite flag to each home
    const updatedHomeDetails = homeDetails.map((home) => {
      return {
        ...home.toObject(),
        isfavourite: favouriteIds.includes(home._id.toString()),
      };
    });

    res.render("store/home-list", {
      homeDetails: updatedHomeDetails,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.log("The data is not found : ", error);
  }
};

exports.getHomeDetails = async (req, res) => {
  const homeId = req.params.homeId;

  const home = await Home.findById(homeId);

  res.render("store/home-details", {
    home: home,
    pagetitle: "Homes List",
    user: req.session.user,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getbookings = (req, res) => {
  res.render("store/bookings", {
    user: req.session.user,
    isLoggedIn: req.session.isLoggedIn,
    bookings: [
      {
        placeName: "manali",
        date: "2025-06-23",
        guests: 6,
        price: 8000,
        status: "confirmed",
      },
      {
        placeName: "manali",
        date: "2025-06-23",
        guests: 6,
        price: 8000,
        status: "confirmed",
      },
    ],
  });
};

exports.getIndex = (req, res) => {
  Home.find().then((homeDetails) => {
    res.render("store/index", {
      homeDetails: homeDetails,
      user: req.session.user,
    });
  });
};

exports.addToFavourites = async (req, res) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  console.log("The userId is this : ", userId);
  const User = await user.findById(userId);

  if (!User.favourites.includes(homeId)) {
    User.favourites.push(homeId);
    await User.save();
  }
  res.redirect("/favourites");
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const User = await user.findById(userId).populate("favourites");

  res.render("store/favourite-list", {
    favouritemHomes: User.favourites,
    user: req.session.user,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.deleteFavourites = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const User = await user.findById(userId);

  if (User.favourites.includes(homeId)) {
    User.favourites = User.favourites.filter((fav) => fav != homeId);
    await User.save();
  }
  return res.redirect("/favourites");
};
