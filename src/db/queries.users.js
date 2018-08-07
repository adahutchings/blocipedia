require("dotenv").config();

const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

    createUser(newUser, callback) {
        
        const salt = bcrypt.genSaltSync();
        const hashedPassword  = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            userName: newUser.userName,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {

            const msg = {
                to: newUser.email,
                from: 'donotreply@blocipedia.com',
                subject: 'Welcome to Blocipedia',
                text: 'Thank you for joining Blocipedia. To start contributing to the Wiki community please visit the site and login with the user information you provided. Looking forward to collaborating with you! - The Blocipedia Team',
                html: 'Thank you for Joining Blocipedia. To start contributing to the Wiki community please visit the site and login with the user information you provided.<br>Looking forward to collaborting with you!<br><br>-The Blocipedia Team',
            };

            sgMail.send(msg);

            callback(null, user);
        })
        .catch((err) => { 
            callback(err);
        })
    },

    upgrade(id, callback){
        return User.findById(id)
        .then((user) => {
            if(!user){
                return callback("User does not exist");
            } else {
                return user.updateAttributes({role: "premium"});
            }
        })
        .catch((err) => {
            callback(err);
        })
    },

    downgrade(id, callback){
        return User.findById(id)
        .then((user) => {
            if(!user){
                return callback("User does not exist");
            } else {
                return user.updateAttributes({role: "standard"});
            }
        })
        .catch((err) => {
            callback(err);
        })
    }

}