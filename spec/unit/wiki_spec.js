const sequelize = require("../../src/db/models/index").sequelize;

describe("Wiki", () => {
    
    beforeEach((done) => {
        this.wiki;
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