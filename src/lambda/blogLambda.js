const dynamo = require("../dbServices/dynamo");

const blogLambda = {}

blogLambda.create = async (req, res) => {
    const payload = req.body;
    payload.blogger = req.params?.userId;
    if ("post" in payload && typeof payload.post === "string"){
        data = await dynamo.create(payload, "blog");
        if ("error" in data){
            return res.status(500).json({
                    status: "failed",
                    error: data.error
                });
        }
        res.json({
            status: "success",
            data: data
        });
    }
};


blogLambda.getPost = async (req, res) => {
    const { id } = req.params;
    const item = await dynamo.getBlogPost(id);
    if ("error" in item) {
         return res.status(item.statusCode).json({
                status: "failed",
                error: item.error
            });
    }
    res.json({
        status: "success",
        item
    })
}

blogLambda.updatePost = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const result = await dynamo.updatePost(id, body);
    if ("error" in result) {
        return res.status(result.statusCode).json({
            status: "failed",
            error: item.error
        });
    }
    res.json({
        status: "success",
        message: result
    })
}

module.exports = blogLambda;