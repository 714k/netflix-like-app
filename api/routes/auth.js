const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch(error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });

    !user && res.status(401).json('User not found');

    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if(!isValidPassword) {
      return res.status(401).send({
        message: "Invalid password"
      });
    }

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.SECRET_KEY_JWT, { expiresIn: "5d"});

    const { password, ...userInfo } = user._doc;

    res.status(200).json({...userInfo, accessToken}); 
    
  } catch(error) {
    res.status(500).json(error);
  }
});

router.get('/users', (req, res) => {
  try {

  } catch(error) {
    res.status(500).json(error);
  }
});

module.exports = router;