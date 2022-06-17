const router = require("express").Router();
const blogLambda = require("../lambda/blogLambda");

// create user
router.post(
    "/new",
    blogLambda.create
);

module.exports = router;