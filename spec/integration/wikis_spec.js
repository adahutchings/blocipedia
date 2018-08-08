const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";
const sequelize = require("../../src/db/models/index").sequelize;

const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

    describe("Premium and Admin performing CRUD on wikis", () => {
        beforeEach((done) => {
            this.user;
            this.wiki;

            sequelize.sync({force: true}).then((res) => {
                User.create({
                    userName: "premiumUser",
                    email: "premium@example.com",
                    password: "1234567890",
                    role: "premium"
                })
                .then((user) => {
                    this.user = user;
                    request.get({
                        url: "http://localhost:3000/auth/fake",
                        form: {
                            role: user.role,
                            userId: user.id,
                            email: user.email,
                            //userName: user.userName
                        }
                    });

                    Wiki.create({
                        title: "This is a secret",
                        body: "Premium members can make private wikis.",
                        userId: user.id
                    })
                    .then((wiki) => {
                        this.wiki = wiki;
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    })
                })
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        describe("GET /wikis/private", () => {
            it("should render the private wiki page", (done) => {
                request.get(`${base}/private`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Private Wikis");
                    done();
                });
            });
        });

        describe("GET /wikis/create", () => {
            it("should create a new private wiki", (done) => {
                const options = {
                    url: `${base}/create`,
                    form: {
                        title: "This is a secret wiki",
                        body: "Premium members can create private wikis.",
                        userId: this.user.id,
                        private: true
                    }
                };

                
                request.post(options, (err, res, body) => {
                    Wiki.findOne({where: {title: "This is a secret wiki"}})
                    .then((wiki) => {
                        expect(wiki).not.toBeNull();
                        expect(wiki.title).toBe("This is a secret wiki");
                        expect(wiki.body).toBe("Premium members can create private wikis.");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            })
        })

    });

    //STANDARD USER
    describe("Standard User performing CRUD on wikis", () => {
        
        beforeEach((done) => {
            this.wiki;
            this.user;

            sequelize.sync({force: true}).then((res) => {
                User.create({
                    userName: "exampleUser",
                    email: "example@example.com",
                    password: "1234567890",
                    role: "standard"
                })
                .then((user) => {
                    this.user = user;
                    
                    request.get({
                        url: "http://localhost:3000/auth/fake",
                        form: {
                            role: user.role,
                            userId: user.id,
                            email: user.email,
                        }
                    })
                })
                .then(() => {
                    Wiki.create({
                        title: "First Wiki",
                        body: "This is the first wiki",
                    })
                    .then((wiki) => {
                        this.wiki = wiki;
                        done();
                    })
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

        describe("GET /wikis/new", () => {
            it("should render a new post form", (done) => {
                request.get(`${base}/new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Wiki");
                    done();
                });
            });
        });

        describe("POST /wikis/create", () => {
            
            it("should create a new wiki and redirect", (done) => {

                const options = {
                    url: `${base}/create`,
                    form: {
                        title: "This is a member wiki",
                        body: "Members can create wikis.",
                        userId: this.user.id,
                        private: false
                    }
                };

                
                request.post(options, (err, res, body) => {
                    Wiki.findOne({where: {title: "This is a member wiki"}})
                    .then((wiki) => {
                        expect(wiki).not.toBeNull();
                        expect(wiki.title).toBe("This is a member wiki");
                        expect(wiki.body).toBe("Members can create wikis.");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });

        describe("GET /wikis/:id", () => {
            it("should render a view with the selected wiki", (done) => {
                request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("First Wiki");
                    done();
                });
            });
        });

        describe("POST /wikis/:id/destroy", () => {
            it("should delete the wiki with associated id", (done) => {
                Wiki.all()
                .then((wikis) => {
                    const wikiCountBeforeDelete = wikis.length;
                
                    expect(wikiCountBeforeDelete).toBe(1);

                    request.post(`${base}/${this.wiki.id}/destroy`, (err, res, body) => {
                        Wiki.all()
                        .then((wikis) => {
                            expect(err).toBeNull();
                            expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        })
                    })
                })
            });
        });

        describe("GET /wikis/:id/edit", () => {
            it("should render a view with an edit wiki form", (done) => {
                request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Edit Wiki");
                    expect(body).toContain("First Wiki");
                    done();
                });
            });
        });

        describe("POST /wikis/:id/update", () => {
            
            it("should update the wiki with the given values", (done) => {
            
                request.post({
                    url: `${base}/${this.wiki.id}/update`,
                    form: {
                        title: "The 1st Wiki",
                        body: "This was the first wiki",
                        userId: this.user.id
                    }
                }, (err, res, body) => {
                    expect(err).toBeNull();
                    Wiki.findOne({
                        where: {id: 1}
                    })
                    .then((wiki) => {
                        expect(wiki.title).toBe("The 1st Wiki");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
    });

});