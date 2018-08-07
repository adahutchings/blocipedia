const userQueries = require("../db/queries.users.js");
const passport = require("passport");

const secretKey = process.env.SECRET_KEY;
const publishableKey = process.env.PUBLISHABLE_KEY;
const stripe = require("stripe")(secretKey);


module.exports = {

    signUp(req, res, next){
        res.render("users/sign_up");
    },

    create(req, res, next){
        
        let newUser = {
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };

        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect("/users/sign_up");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })
            }
        });
    },
    signInForm(req, res, next){
        res.render("users/sign_in");
    },

    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
            if(!req.user){
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/sign_in");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            }
        })
    },

    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },

    upgrade(req, res, next){
        res.render("users/upgrade", {publishableKey});
    },

    payment(req, res, next){
        let payment = 1500;
        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
        })
        .then((customer) => {
            stripe.charges.create({
                amount: payment,
                description: "Blocipedia Premium Membership",
                currency: "USD",
                customer: customer.id
            })
        })
        .then((charge) => {
            userQueries.upgrade(req.dataValues.id);
            res.render("users/payment_success");
        })
    }


}