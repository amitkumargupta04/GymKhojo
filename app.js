// if(process.env.NODE_ENV != "production"){
//   require("dotenv").config();
// }

const express = require('express')
const app = express()
const port = 8080;
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport")
const User = require("./models/user.js");
const LocalStrategy = require("passport-local")

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")


main().then((data) => console.log("Connection successFull"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))


const sessionOptions = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
//server check
app.get("/", (req, res) =>{
  res.send("Server working well")
});

app.use(session(sessionOptions));
app.use(flash());

// for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // for signup login logout
  next();
})

//our routers
app.use("/listings", listingRouter); // yaha pe direct bhi require kar skte hai
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter)

// ye middleware hames Page not found show karega agr backend se kuch error ata ha to
app.use((err, req, res, next) =>{ // it is overall error msg popup when user wrong data 
  res.send("Something went wrong !")
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})