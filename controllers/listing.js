let listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
module.exports.renderHome = async(req , res) => {
    let listings = await listing.find({});
    res.render("home.ejs" , {listings});
}

module.exports.createListing = async (req, res) => {
      let response = await geocodingClient
      .forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send();

      let url = req.file.path;
      let filename = req.file.filename;
      const { title, description,image, price, location, country } = req.body;
      const newListing = new listing({ title, description,image, price, location, country });
      newListing.owner = req.user._id;
      newListing.image = {url , filename};
      newListing.geometry = response.body.features[0].geometry;
      let savedlisting = await newListing.save();
      console.log(savedlisting);
      req.flash("success" , "New listing Created");
      res.redirect("/listing");
}

module.exports.renderShow = async (req, res) => {
    try {
      const id = req.params.id;
      const onelisting = await listing.findById(id)
        .populate
        ({path: "reviews",
        populate:
        {path: "author"},
        }).populate("owner");
      
      if (onelisting) {
        onelisting.price = formatPrice(onelisting.price); // Format the price
        res.render("one.ejs", { listing: onelisting, formatPrice: formatPrice }); 
      } else {
        res.status(404).send("Listing not found");
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).send("An error occurred while fetching the listing");
    }
  }

module.exports.renderEdit = async(req,res)=>{
    const id = req.params.id;
    const editLisiting = await listing.findOne({_id : id});
    res.render("edit.ejs" , {editLisiting});
  }

module.exports.editListing = async(req,res) =>{
    try {
      const { title, description,image , price, location, country } = req.body;
      let id = req.params.id;
      
      const newListing1 = await listing.updateMany({ _id: id }, { title, description,image , price, location, country });
      
      if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        newListing1.image = {url , filename};
        await newListing1.save();
      }

      req.flash("success" , "Listing Updated Successfully");
      res.redirect("/listing/"+id); 
    } catch (error) {
      console.error("Error creating a new listing:", error);
      
      res.status(500).send("An error occurred while creating the new listing");
    }
  }

module.exports.destroyListing = async (req, res) => {
    try {
      let id = req.params.id;
      await listing.findByIdAndDelete(id);
      req.flash("success", "Listing Deleted");
      return res.redirect("/listing"); // Use 'return' to stop execution after sending the redirect
    } catch (error) {
      console.error(error);
      req.flash("error", "Error deleting listing");
      return res.redirect("/listing");
    }
  }