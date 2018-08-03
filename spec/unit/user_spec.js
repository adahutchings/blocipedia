const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
    beforeEach((done) => {
        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("#create()", () => {
        it("should create a User object with a valid email, password, and username", (done) => {
            User.create({
                userName: "exampleUser",
                email: "user@example.com",
                password: "1234567890"
            })
            .then((user) => {
                expect(user.userName).toBe("exampleUser");
                expect(user.email).toBe("user@example.com");
                expect(user.id).toBe(1);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a user with an invaild email, password, or username", (done) => {
            User.create({
                userName: "user1",
                email: "Hey-a",
                password: "1234567890"
            })
            .then((user) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Validation error: must be a vaild email");
                done();
            });
        });

        it("should not create a user with an email already taken", (done) => {
            User.create({
                userName: "exampleUser",
                email: "user@example.com",
                password: "1234567890",

            })
            .then((user) => {
                User.create({
                    userName: "user1",
                    email: "user@example.com",
                    password: "catsrule"
                })
                .then((user) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Validation error");
                    done();
                });

                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a user with a username already taken", (done) => {
            User.create({
                userName: "exampleUser",
                email: "user@example.com",
                password: "1234567890"
            })
            .then((user) => {

                User.create({
                    userName: "exampleUser",
                    email: "user2@example.com",
                    password: "1234567890"
                })
                .then((user) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Validation error");
                    done();
                });
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });



});