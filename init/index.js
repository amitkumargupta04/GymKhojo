const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main().then((data) => console.log("Connection successFull"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');
};

const initDB = async () =>{
  await Listing.deleteMany({}); // pahle se koi data ho remove ho jayega
  initData.data = initData.data.map((obj) => ({ ...obj, owner: '6806b1667b76c3076cf35b18'}))
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
}
initDB();
//Listing.insertMany(initData.data);