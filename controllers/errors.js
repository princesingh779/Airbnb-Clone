exports.notFound = (req, res) => {
  res.render("404", {
    isLoggedIn: req.isLoggedIn,
    user: {},
  });
};
