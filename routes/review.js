const express = require("express");
let router = express.Router({mergeParams : true});
let Review = require("../models/review.js");
let listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Reviews..
// Reviews route in app.js
router.post("",isLoggedIn, reviewController.createReview);
  
  //Delete Reviews...
  router.delete("/:reviewid" , reviewController.destroyReview);

module.exports = router;