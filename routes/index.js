const { __express } = require("hbs");
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
    // render
  })
  .catch(err => console.log(err))

  // const match = bcrypt.compareSync(passTest, hashedPass)
  // console.log("DO THEY MATCH?", match)
})



module.exports = router;
