const User = require("../models/user");

module.exports.signupForm =(req, res) =>{ // common path ko app.js me bhej dia jata h
    res.render("users/signup.ejs")
}

module.exports.signupDone = async(req, res) =>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email})
        const registeredUser = await User.register(newUser, password);
        //after signup direct login
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcome")
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("success", e.message);
        res.redirect("/signup");
    }

}

module.exports.loginPage = (req, res) =>{
    res.render("users/login.ejs")
}
module.exports.loginDone = async (req, res) => {
    req.flash("success", "Hey welcome");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) =>{
    req.logOut((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    });
}