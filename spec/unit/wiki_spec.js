const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {

    beforeEach((done) => {
        this.wiki;
        this.user;
        
        sequelize.sync({force: true}).then((res) => {
            
            User.create({
                email: "mrman@example.com",
                password: "1234567890",
                role: "standard"
            })
            .then((user) => {
                this.user = user;

                Wiki.create({
                    title: "First Wiki",
                    body: "This is the very first wiki.",
                    userId: this.user.id
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

    describe("#create()", () => {
        it("should create a wiki with a title and body", (done) => {
            Wiki.create({
                title: "The art of Techno",
                body: "Techno has a long history"
            })
            .then((wiki) => {
                expect(wiki.title).toBe("The art of Techno");
                expect(wiki.body).toBe("Techno has a long history");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a wiki without a title or body", (done) => {
            Wiki.create({
                title: "This wiki has no body",
            })
            .then((wiki) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Wiki.body cannot be null");
                done();
            })
        });
    });
    



});