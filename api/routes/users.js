const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const verify = require("../verifyToken");

// UPDATE
router.put("/:id", verify, async(req, res) => {
  const id = req.params.id;
  const password = req.body.password;

  if(req.user.id === id || req.user.isAdmin) {
    if(password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, { new: true });

      res.status(200).json(updatedUser);
    } catch(error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can not allowed update this user");
  }
});


// DELETE
router.delete("/:id", verify, async(req, res) => {
  const id = req.params.id;

  if(req.user.id === id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User Deleted");
    } catch(error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can not allowed delete this user");
  }
});

// GET
router.get("/find/:id", async(req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...userInfo } = user._doc;
    res.status(200).json(userInfo);
  } catch(error) {
    res.status(500).json(error);
  }
});

// GET ALL
router.get("/", verify, async(req, res) => {
  const limit = req.query.limit;
  console.log("limit", limit);
  try {
    const users = limit ? 
      await User.find()
        .sort({_id: -1})
        .limit(Number(limit)) : 
      await User.find();
    res.status(200).json(users);
  } catch(error) {
    res.status(500).json(error);
  }
});

// GET USER STATS
router.get("/stats", async (req, res) => {
  const today = new Date();
  const lastYear = today.setUTCFullYear(today.setFullYear() - 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: {
            $month: "$createdAt"
          }
        }
      }, {
        $group: {
          _id: "$month",
          total: {
            $sum: 1
        }
      }
    }]);

    res.status(200).json(data);
  } catch(error) {
    res.status(500).json(error);
  }
});

module.exports = router;