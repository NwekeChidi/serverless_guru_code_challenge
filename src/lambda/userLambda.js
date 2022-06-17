const dynamo = require("../db/dynamo");

const userLambda = {}

userLambda.create = async (req, res) => {
    const payload = req.body;
    if ("name" in payload && payload.name === string){
        data = await dynamo.createUser(payload);
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