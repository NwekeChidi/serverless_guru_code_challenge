const dynamo = require("../dbServices/dynamo");

const blogLambda = {};

blogLambda.create = async (req, res) => {
    const payload = req.body;
    payload.blogger = req.params?.userId;
    if ("post" in payload && typeof payload.post === "string"){
        data = await dynamo.create(payload, "blog");
        if ("error" in data){
            res.status(500);
            return res.json({
                    status: "failed",
                    error: data.error
                });
        };
        res.status(201);
        return res.json({
            status: "success",
            data: data
        });
    };
    res.status(400);
    res.json({
        status: "failed",
        message: "Could not create empty post"
    });
};


blogLambda.getPost = async (req, res) => {
    const { id } = req.params;
    const item = await dynamo.getBlogPost(id);
    if ("error" in item) {
        res.status(item.statusCode); 
        return res.json({
                status: "failed",
                error: item.error
            });
    };
    res.status(200);
    res.json({
        status: "success",
        item
    });
};

blogLambda.updatePost = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const result = await dynamo.updatePost(id, body);
    if ("error" in result) {
        res.status(result.statusCode);
        return res.json({
            status: "failed",
            error: result.error
        });
    };
    res.status(200);
    res.json({
        status: "success",
        message: result
    });
};


blogLambda.deletePost = async (req, res) => {
    const { id } = req.params;
    const result = await dynamo.deletePost(id);
    if ("error" in result) {
        res.status(result.statusCode);
        return res.json({
            status: "failed",
            error: result.error
        });
    };
    res.status(200);
    res.json({
        status: "success",
        message: result
    });
};

module.exports = blogLambda;