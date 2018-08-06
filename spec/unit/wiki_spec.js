const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {

    beforeEach((done) => {
        this.wiki;
        this.user;
        
        sequelize.sync({force: true}).then((res) => {
            Wiki.create({
                title: "First Wiki",
                body: "This is the very first wiki."
            })
            .then((wiki) => {
                this.wiki = wiki;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });


});