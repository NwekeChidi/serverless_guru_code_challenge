const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { zipObject } = require("lodash");

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
  async getBlogPost(PK) {
    const params = {
      TableName: BLOGS_TABLE,
      Key: {
        PK,
        SK: "blog"
      },
    };

    try {
      const { Item } = await dynamoDbClient.get(params).promise();
      if (Item) {
        return Item;
      } else {
        return {
          statusCode: 404,
          error: 'Could not find item with provided "id"',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        error: "Could not retreive Item",
      };
    }
  }

  // Update Blog Post
  async updatePost(PK, data) {

    const attrsName = Object.keys(data);
    const values = Object.values(data);

    // get a list of key names and value names to match the dynamodb syntax
    const attributeKeyNames = attrsName.map((k) => "#key_" + k);
    const attributeValueNames = attrsName.map((k) => ":val_" + k);

    // create individual expressions for each attribute that needs to be updated
    const expressions = attributeValueNames.map((attrs, i) => {
      return `${attributeKeyNames[i]} = ${attrs}`;
    });

    const UpdateExpression = "SET " + expressions.join(", ");

    // map key value arrays
    const ExpressionAttributeValues = zipObject(attributeValueNames, values);
    const ExpressionAttributeNames = zipObject(attributeKeyNames, attrsName);

    // now you have all the params
    const params = {
      TableName: BLOGS_TABLE,
      Key: {
        PK,
        SK: "blog"
      },
      UpdateExpression,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
    };
    try {
      await dynamoDbClient.update(params).promise();
      return "Update Successful";
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        error: "Could not update document",
      };
    }
  }
}

module.exports = new Dynamo();
