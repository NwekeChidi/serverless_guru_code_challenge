const AWS = require("aws-sdk");
const { v4 :uuidv4 } = require("uuid");

const BLOGS_TABLE = process.env.BLOGS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

class Dynamo {
    // Create Document
    async create (data, sortKey) {
        const _id = uuidv4();
        data.PK = _id;
        data.SK = sortKey;
        const params = {
            TableName: BLOGS_TABLE,
            Item: data,
        };
          
        try {
            await dynamoDbClient.put(params).promise();
            return data;
        } catch (error) {
            console.log(error);
            return { error: "Failed to create new document" };
        }
    }
}


module.exports = new Dynamo();