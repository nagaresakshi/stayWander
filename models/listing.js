const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review");
const user = require("./user");
const urlencoded = require("body-parser/lib/types/urlencoded");

const listingSchema = new schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        url: String,
        filename: String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [{
        type : schema.Types.ObjectId,
        ref : "Review",
    }],
    owner :{
        type : schema.Types.ObjectId,
        ref : "user",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
        coordinates: {
            type: [Number],
            required: true
          }
    }
});

module.exports = mongoose.model('listing', listingSchema);
