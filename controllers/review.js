let Review = require("../models/review.js");
let listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let id = req.params.id;
    try {
      let Listing = await listing.findById(id);
      let newreview = {
        rating: req.body['review[rating]'],
        comment: req.body['review[comment]'],
      };
      newreview.author = req.user._id;
      console.log(newreview);
  
      // Assuming Review is your model for reviews
      const savedReview = await Review.create(newreview); // Create and save the review
  
      Listing.reviews.push(savedReview._id); // Push the review ID to the listing's reviews array
      
      await Listing.save();
      req.flash("success" , "Review Added");
      res.redirect("/listing/"+id);
    } catch (error) {
      console.error("Error saving review:", error);
      res.status(500).send("An error occurred while saving the review");
    }
  }
  
module.exports.destroyReview = async(req,res) =>{
    let {id , reviewid} = req.params;
  
    await listing.findByIdAndUpdate(id , {$pull : {reviews : reviewid}})
    await Review.findByIdAndDelete(reviewid);
    req.flash("success" , "Review Deleted");
    res.redirect(`/listing/${id}`);
  }