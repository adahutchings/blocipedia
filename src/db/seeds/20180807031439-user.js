'use strict';

const faker = require("faker");
let users = [{
  id: 1,
  userName: "FrankLloyd",
  email: "frank@buildings.com",
  password: "1234567890",
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "standard"
},
{
  id: 2,
  userName: "AnnieClark",
  email: "annie@anniesway.com",
  password: "1234567890",
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "standard"
},
{
  id: 3,
  userName: "SuperMan",
  email: "superman@super.net",
  password: "1234567890",
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "standard"
}];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
