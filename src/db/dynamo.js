const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const BLOGS_TABLE = process.env.BLOGS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

class Dynamo {
  // Create Document
  async create(data, sortKey) {
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

  // Get Blog Post
  async getBlogPost(sortKey) {
    const _id = uuidv4();
    data.PK = _id;
    data.SK = sortKey;
    const params = {
      TableName: BLOGS_TABLE,
      key: {
        SK: sortKey,
      },
    };

    try {
      const { Item } = await dynamoDbClient.get(params).promise();
      if (Item) {
        return Item;
      } else {
        return {
          statusCode: 404,
          error: 'Could not find item with provided "sortKey"',
        };
      }
    } catch (error) {
      console.log(error);
      return { 
        statusCode: 500,
        error: "Could not retreive Item"
      };
    }
  }
}

module.exports = new Dynamo();
