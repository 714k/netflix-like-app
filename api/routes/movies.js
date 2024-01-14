const router = require("express").Router();

const Movie = require("../models/Movie");
const verify = require("../verifyToken");

// CREATE
router.post("/", verify, async(req, res) => {
  console.log(req.user);
  if(req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const savedMovie = await newMovie.save();
      
      res.status(201).json(savedMovie);
    } catch (error) {
      if(error) {
        res.status(500).json(error);
      }
    }
  } else {
    res.status(403).json("You are not allowed to create movies");
  }
});

// UPDATE
router.put("/:id", verify, async(req, res) => {
  if(req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, { new: true });
        
      res.status(200).json(updatedMovie);
    } catch (error) {
      if(error) {
        res.status(500).json(error);
      }
    }
  } else {
    res.status(403).json("You are not allowed to update movies");
  }
});

// DELETE
router.delete("/:id", verify, async(req, res) => {
  if(req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
        
      res.status(200).json("The Movie has been deleted");
    } catch (error) {
      if(error) {
        res.status(500).json(error);
      }
    }
  } else {
    res.status(403).json("You are not allowed to delete movies");
  }
});

// GET
router.get("/find/:id", verify, async(req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
      
    res.status(200).json(movie);
  } catch (error) {
    if(error) {
      res.status(500).json(error);
    }
  }
});

// GET RANDOM
router.get("/random", verify, async(req, res) => {
  const type = req.query.type;
  let movie;
  let isSeries;

  try {
    if(type === "series") {
      isSeries = true;
    } else {
      isSeries = false;
    }

    movie = await Movie.aggregate([
      { $match: { isSeries } },
      { $sample: { size: 1 } }
    ]);

    res.status(200).json(movie);
  } catch (error) {
    if(error) {
      res.status(500).message(error);
    }
  }
});

// GET ALL
router.get("/", verify, async(req, res) => {
  console.log(req);
  try {
    const movies = await Movie.find().sort({title: 1});
    res.status(200).json(movies);  
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;