const router = require("express").Router();
const blogLambda = require("../lambda/blogLambda");

// create user
router.post(
    "/new/:userId",
    blogLambda.create
);

module.exports = router;