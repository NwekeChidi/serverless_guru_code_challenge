const router = require("express").Router();
const blogLambda = require("../lambda/blogLambda");

// create blog post
router.post(
    "/new/:userId",
    blogLambda.create
);

// get blog post
router.get(
    "/view/:sortKey",
    blogLambda.getPost
);

// edit blog post
router.patch(
    "/update/:sortKey",
    blogLambda.updatePost
)
module.exports = router;