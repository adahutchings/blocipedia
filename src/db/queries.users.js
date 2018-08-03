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
                from: 'donotreply@example.com',
                subject: 'Welcome to Blocipedia',
                text: 'Thanks for joining Blocipedia',
                html: '<strong>To start contributing to the Wiki community please log in</strong>',
            };

            sgMail.send(msg);
            console.log("=== TEST ===");
            console.log(msg);
            console.log("=== END ===");
            callback(null, user);
        })
        .catch((err) => {
            console.log(err);
            callback(err)
        })
    },

}