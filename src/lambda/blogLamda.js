const dynamo = require("../db/dynamo");

const blogLambda = {}

blogLambda.create = async (req, res) => {
    const payload = req.body;
    payload.blogger = req.params?.userId;
    if ("post" in payload && typeof payload.post === "string"){
        data = await dynamo.create(payload, "blog");
        if ("error" in data){
            res.status(500).json({
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

module.exports = blogLambda;