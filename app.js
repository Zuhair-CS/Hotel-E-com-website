const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
var methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError.js"); 
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const Listing = require("./models/listing.js");
const session = require("express-session");
const flash = require("connect-flash");
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookies: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then((res)=>{
    console.log("connection successful");
}).catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// app.get("/testListing",async (req, res) => {
//     let sampleListing = new listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calungut, Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Success");
// });

app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/",(req, res) => {
    res.redirect("listings/");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, (req,res)=>{
    console.log("Sever is listening to port 8080");
});