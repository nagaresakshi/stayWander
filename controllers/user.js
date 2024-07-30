let user = require("../models/user");
const { saveRedirectUrl } = require("../middleware");

module.exports.signUpUser = async(req , res , next) => {
    try{
        let {username , password , email} = req.body;
        const newuser = new user({email , username});
        const registeredUser = await user.register(newuser , password);
        console.log(registeredUser);
        req.login(registeredUser , (err) => {
            if(err){
                next(err);
            }
            req.flash("success" , "Account Created!");
            res.redirect("/listing");
        })
    }
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}

module.exports.loginUser = async(req , res) => {
    let redirectUrl = res.locals.redirectUrl || "/listing";
    req.flash("success" , "Welcome back to Wenderlust!");
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "logged you out!");
        res.redirect("/listing");
    });
}