const mongoose = require("mongoose");
const initData = require("./data");
const listing = require("../models/listing.js");

main()
    .then(()=>{
    console.log("Successfully connected to db");
})  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDb = async() =>{
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("Data inserted successfully");
}

initDb();