const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")

const userControle = require("../controlers/user.js")

router.get("/signup", userControle.signupForm);

router.post("/signup", wrapAsync(userControle.signupDone));

router.get("/login", userControle.loginPage);

router.post('/login', saveRedirectUrl, 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    userControle.loginDone
);

router.get("/logout", userControle.logout);
    
module.exports = router;