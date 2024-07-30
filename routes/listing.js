const express = require("express");
let router = express.Router();
let listing = require("../models/listing.js");
const methodOverride = require("method-override");
const listings = require("../routes/listing.js");
const flash = require("connect-flash/lib/flash.js");
const {isLoggedIn} = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.use(methodOverride("_method"));

router
.route("/")
.get(listingcontroller.renderHome)        //root route
.post(
  isLoggedIn,                             //create route
  upload.single("image"),
  listingcontroller.createListing
  );

//New route
router.get("/new",isLoggedIn , (req , res) => {
  res.render("new.ejs");
});

router.route("/:id")
.get(listingcontroller.renderShow)            //show route
.post(
  isLoggedIn,
  upload.single("image"),
  listingcontroller.editListing)          //edit route
.delete(listingcontroller.destroyListing);    // Delete Route

//Edit Route...
router.get("/:id/edit", isLoggedIn , listingcontroller.renderEdit);

module.exports = router;