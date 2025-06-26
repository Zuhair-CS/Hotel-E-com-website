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

const axios = require("axios");
const MAPBOX_TOKEN = "pk.eyJ1IjoienVoYWlyMjk0NSIsImEiOiJjbWM5OHVuYmswMGJzMnFzaTBmN2lkYWNnIn0.E-vcFkx7jrbfwddE-7EssQ";

const initDB = async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});

  const user = new User({ username: "listingAdmin", email: "admin@example.com" });
  const registeredUser = await User.register(user, "zuhairm3");

  // Create listings with geometry field
  const listingsWithOwner = [];

  for (let obj of initData.data) {
    try {
      const geoData = await geocodeLocation(obj.location);
      const newListing = {
        ...obj,
        owner: registeredUser._id,
        geometry: geoData,
      };
      listingsWithOwner.push(newListing);
    } catch (err) {
      console.error(`Failed to geocode ${obj.location}:`, err.message);
    }
  }

  await Listing.insertMany(listingsWithOwner);
  console.log("Database seeded successfully with geometry");
};

// Geocoding helper
async function geocodeLocation(location) {
  const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`, {
    params: {
      access_token: MAPBOX_TOKEN,
    },
  });

  if (!response.data.features || response.data.features.length === 0) {
    throw new Error("No geocoding result");
  }

  const [lng, lat] = response.data.features[0].center;
  return {
    type: "Point",
    coordinates: [lng, lat],
  };
}

initDB();