const router = require("express").Router();
const blogLambda = require("../lambda/blogLambda");

// create blog post
router.post(
    "/new/:userId",
    blogLambda.create
);

// get blog post
router.get(
    "/view/:id",
    blogLambda.getPost
);

// edit blog post
router.patch(
    "/update/:id",
    blogLambda.updatePost
);

// delete blog post
router.delete(
    "/delete/:id",
    blogLambda.deletePost
)
module.exports = router;