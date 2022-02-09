const { __express } = require("hbs");
const req = require("express/lib/request");

const router = require("express").Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User.model')

const saltRounds = 10;


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', function(req,res) {
  res.render('signup')
})


router.post('/signup', function(req, res) {
  let errors = [];

  if (!req.body.username) {
    errors.push("You didn't include a name!")
  }
  if (!req.body.password) {
    errors.push("you need a password!")
  }

  if (errors.length > 0) {
    console.log("ERRORS SIGING UP", errors)
    res.render('signup', errors)
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt)
  // console.log("SALT", salt)
  // console.log("hashedPass", hashedPass)

  User.create({
    username: req.body.username,
    password: hashedPass
  })
  .then(createdUser => {
    console.log("user was created woo!!", createdUser)
    res.render('profile')
    // Add session
    console.log(req.session)
    req.session.user = createdUser;
    console.log(req.session.user)
    // render
  })
  .catch(err => console.log("ERROR CREATING USER", err))

  // const match = bcrypt.compareSync(passTest, hashedPass)
  // console.log("DO THEY MATCH?", match)
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  let errors = [];

  if (!req.body.username) {
    errors.push("you didnt include username")
  }

  if (!req.body.password) {
    errors.push("you need password")
  }

  if (errors.length > 0) {
    console.log("errorss", errors)
  }

  // VERIFY USERNAME AND PASSWORD
  User.findOne({ username: req.body.username })
  .then(foundUser => {
    // if user doesn't exist
    if (!foundUser) {
      return console.log("username not found")
    }

    // if username is found, check password
    const match = bcrypt.compareSync(req.body.password, foundUser.password)

    // if passwords dont match
    if (!match) {
      return console.log("INCORRECT PASSWORD")
    }

    // if username and passwords match
    console.log(req)
    console.log(req.session)
    req.session.user = foundUser;

    console.log(req.session.user)
    res.render('profile', {user: foundUser})
  })
})

module.exports = router;
