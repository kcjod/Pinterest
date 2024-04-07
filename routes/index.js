var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const localStrategy = require("passport-local");
const passport = require("passport");
const upload = require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Pinterest", err: req.flash("error") });
});


router.get("/feed", isLoggedIn, async function (req, res, next) {
  try {
    const posts = await postModel.find().populate('user');
    res.render("feed",{posts: posts});
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error fetching posts");
  }
});



router.get("/profile", isLoggedIn, async function (req, res, next) {
  const userdata = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");

  res.render("profile", { user: userdata });
});

router.get("/login", function (req, res, next) {
  res.render("login", { err: req.flash("error") });
});

router.post("/register", function (req, res) {
  userModel.findOne({ username: req.body.username })
    .then(existingUser => {
      if (existingUser) {
        // Username already exists, send flash message
        req.flash("error", "Username already exists.");
        return res.redirect("/"); // Redirect to the home page
      }

      const userData = new userModel({
        username: req.body.username,
        email: req.body.email,
        fullName: req.body.fullName,
      });

      userModel.register(userData, req.body.password)
        .then(() => {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/feed");
          });
        })
        .catch(error => {
          console.error(error);
          req.flash("error", "Error creating user.");
          res.redirect("/");
        });
    })
    .catch(error => {
      console.error(error);
      req.flash("error", "Error checking existing user.");
      res.redirect("/");
    });
});


router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(404).send("Error while uploading the file.");
    }

    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      posttext: req.body.title, // Provide the posttext from the request body
      image: req.file.filename,
      user: user._id,
    });

    user.posts.push(post._id);
    await user.save();

    res.redirect("/profile");
  }
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/feed",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
