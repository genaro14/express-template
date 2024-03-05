const { DynamoDBClient, DeleteTableCommand } = require('@aws-sdk/client-dynamodb');

// Create a DynamoDB client
const dynamodbClient = new DynamoDBClient({
  endpoint: 'http://localhost:8000', // Adjust the port if needed
  region: 'localhost'
});

// Function to delete a table
async function deleteTable(tableName) {
  const command = new DeleteTableCommand({ TableName: tableName });

  try {
    await dynamodbClient.send(command);
    console.log(`Table '${tableName}' deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting table '${tableName}':`, error.message);
  }
}

// List of table names to delete
const tableNamesToDelete = ['crossmark_metadata', 'crossmark', 'crossmark_retailers_info', 'crossmark_high_score_products'];

// Function to delete all tables in the list
const deleteAll = async () => {
  for (const tableName of tableNamesToDelete) {
    console.log("Deleting table:", tableName);
    await deleteTable(tableName);
  }
};

// Call the deleteAll function
deleteAll();