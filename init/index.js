const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});

  const user = new User({ username: "listingAdmin", email: "admin@example.com" });
  const registeredUser = await User.register(user, "zuhairm3"); // Register with passport-local-mongoose

  // Assign real user ID to each listing
  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: registeredUser._id,
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("Database seeded successfully");
}; 
initDB();
  