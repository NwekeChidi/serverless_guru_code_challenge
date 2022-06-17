const router = require("express").Router();
const userLambda = require("../lambda/userLambda");

// create user
router.post(
    "/users/new",
    userLambda.create
);

module.exports = router;