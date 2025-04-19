const AWS = require("aws-sdk");

class UserRepository {
  constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    this.tableName = process.env.USERS_TABLE;
  }

  async create(user) {
    await this.dynamoDb
      .put({
        TableName: this.tableName,
        Item: user,
      })
      .promise();
    return user;
  }

  async findById(userId) {
    const result = await this.dynamoDb
      .get({
        TableName: this.tableName,
        Key: { id: userId },
      })
      .promise();

    return result.Item || null;
  }

  async findByEmail(email) {
    const result = await this.dynamoDb
      .query({
        TableName: this.tableName,
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
      .promise();

    return result.Items && result.Items.length > 0 ? result.Items[0] : null;
  }

  async findAll() {
    const result = await this.dynamoDb
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items || [];
  }

  async update(userId, updateData) {
    // Build update expression
    let updateExpression = "set";
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    Object.keys(updateData).forEach((key, index) => {
      const attributeName = `#${key}`;
      const attributeValue = `:${key}`;

      updateExpression += index === 0 ? ` ${attributeName} = ${attributeValue}` : `, ${attributeName} = ${attributeValue}`;
      expressionAttributeValues[attributeValue] = updateData[key];
      expressionAttributeNames[attributeName] = key;
    });

    await this.dynamoDb
      .update({
        TableName: this.tableName,
        Key: { id: userId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: "NONE",
      })
      .promise();
  }

  async delete(userId) {
    await this.dynamoDb
      .delete({
        TableName: this.tableName,
        Key: { id: userId },
      })
      .promise();
  }
}

module.exports = UserRepository;