const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res) => {
  res.render("auth/Login.ejs", {
    isLoggedIn: false,
    errorMessages: [],
    oldInput: {},
    user: {},
  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);

  if (!user) {
    console.log("I am not able to give u access the length is 0");
    return res.status(422).render("auth/login", {
      isLoggedIn: false,
      errorMessages: ["User does not exist."],
      oldInput: { email },
      user: {},
    });
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    return res.status(422).render("auth/login", {
      isLoggedIn: false,
      errorMessages: ["Password does not matched."],
      oldInput: { email },
      user: {},
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  res.cookie("isLoggedIn", false);

  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup.ejs", {
    errorMessages: [],
    isLoggedIn: false,
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      type: "",
    },
    user: {},
  });
};

exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name should be atleast 2 characters long.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name should contains only alphabets."),
  check("lastName")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name should only contains alphabets."),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one upper case letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain atleast one lower case letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    .matches(/[!@#$%^&*()<>?]/)
    .withMessage("Password should contain atleast one special character.")
    .trim(),

  check("type")
    .notEmpty()
    .withMessage("User type is required ")
    .isIn(["user", "host"])
    .withMessage("Invalid user type."),

  check("termsaccepted")
    .notEmpty()
    .withMessage("Please accept the terms and conditions ")
    .custom((value, { req }) => {
      if (value != "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),
  (req, res, next) => {
    const { firstName, lastName, email, password, type } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("/auth/signup", {
        isLoggedIn: false,
        errorMessages: errors.array().map((error) => error.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          password,
          type,
        },
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashpassword) => {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashpassword,
          type,
        });
        user.save();
      })
      .then(() => {
        res.redirect("/auth/login");
      })
      .catch((err) => {
        res.status(422).render("/auth/signup", {
          isLoggedIn: false,
          errors: [err.message],
          oldInput: { firstName, lastName, email, password, type },
          user: {},
        });
      });
  },
];
