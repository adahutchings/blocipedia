const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const User = require("../../src/db/models").User;
const validation = require("./validation");

router.get("/users/sign_up", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_out", userController.signOut);
router.get("/users/upgrade", userController.upgrade);
router.get("/users/collaborations", userController.showCollaborations);
router.post("/users/sign_in", validation.validateUsersSignIn, userController.signIn);
router.post("/users", validation.validateUsers, userController.create);
router.post("/users/:id/upgrade", userController.payment);
router.post("/users/:id/downgrade", userController.downgrade);


module.exports = router;