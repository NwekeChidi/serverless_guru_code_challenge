const dynamo = require("../dbServices/dynamo");

const userLambda = {};

userLambda.create = async (req, res) => {
  const payload = req.body;
  if ("name" in payload && typeof payload.name === "string") {
    data = await dynamo.create(payload, "user");
    if ("error" in data) {
      res.status(500);
      return res.json({
        status: "failed",
        error: data.error,
      });
    }
    res.status(201);
    return res.json({
      status: "success",
      data: data,
    });
  }
  res.status(400);
  res.json({
    status: "failed",
    message: "Please provide a name",
  });
};

module.exports = userLambda;