const dynamo = require("../dbServices/dynamo");

const userLambda = {}

userLambda.create = async (req, res) => {
    const payload = req.body;
    if ("name" in payload && typeof payload.name === "string"){
        data = await dynamo.create(payload, "user");
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

module.exports = userLambda;