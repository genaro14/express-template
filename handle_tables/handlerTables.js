const fs = require("fs");
const yargs = require("yargs");
const {
  DynamoDBClient,
  DeleteTableCommand,
  ScanCommand,
  DescribeTableCommand,
  PutItemCommand,
  CreateTableCommand,
  ListTablesCommand
} = require("@aws-sdk/client-dynamodb");

const dynamodbClient = new DynamoDBClient({
  endpoint: "http://localhost:8011",
  region: "localhost",
});

const tableNames = [
  "crossmark_metadata",
  "crossmark",
  "crossmark_retailers_info",
  "crossmark_high_score_products",
];

const deleteTable = async (tableName) => {
  try {
    const existingTables = await dynamodbClient.send(new ListTablesCommand());
    if (
      !existingTables.TableNames ||
      !existingTables.TableNames.includes(tableName)
    ) {
      console.log(`Table '${tableName}' does not exist. Skipping deletion.`);
      return;
    }

    const command = new DeleteTableCommand({ TableName: tableName });
    await dynamodbClient.send(command);
    console.log(`Table '${tableName}' deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting table '${tableName}':`, error.message);
    throw error;
  }
};

const deleteAll = async (dataSet) => {
  for (const tableName of dataSet) {
    console.log("Deleting table:", tableName);
    await deleteTable(tableName);
  }
};

async function backupTable(tableName) {
  const scanParams = {
    TableName: tableName,
  };

  try {
    const scanResults = await dynamodbClient.send(new ScanCommand(scanParams));
    const backupFileName = `${tableName}_backup.json`;

    fs.writeFileSync(
      backupFileName,
      JSON.stringify(scanResults.Items, null, 2)
    );

    console.log(`Backup of table '${tableName}' saved to ${backupFileName}`);
  } catch (error) {
    console.error(`Error backing up table '${tableName}':`, error.message);
  }
}

const backupAll = async (dataSet) => {
  for (const tableName of dataSet) {
    console.log("Backing up table:", tableName);
    await backupTable(tableName);
    await writeTableDetailsToFile(tableName);
  }
};

const  writeTableDetailsToFile = async (tableName) => {
  const describeTableParams = {
    TableName: tableName,
  };

  try {
    const tableDetails = await dynamodbClient.send(
      new DescribeTableCommand(describeTableParams)
    );
    const structureFileName = `${tableName}_structure.json`;

    fs.writeFileSync(structureFileName, JSON.stringify(tableDetails, null, 2));

    console.log(
      `Table structure for '${tableName}' written to file: ${structureFileName}`
    );
  } catch (error) {
    console.error(
      `Error getting table structure for '${tableName}':`,
      error.message
    );
  }
}

const deleteAndBackupAll = async (dataSet) => {
  console.log("Backing up ALL tables");
  await backupAll(tableNames);
  console.log("Backup done, now deletion >>> ");
  await deleteAll(tableNames);
};

const createTable = async (tableName) => {x
  // Read the details file to get the attribute definitions and key schema
  const detailsFileName = `${tableName}_structure.json`;

  try {
    // Attempt to read the details file
    const detailsData = fs.readFileSync(detailsFileName, "utf-8");
    const { Table } = JSON.parse(detailsData);

    // Extract attribute definitions and key schema from the Table object
    const attributeDefinitions = Table.AttributeDefinitions.map((attr) => ({
      AttributeName: attr.AttributeName,
      AttributeType: attr.AttributeType,
    }));
    const keySchema = Table.KeySchema.map((key) => ({
      AttributeName: key.AttributeName,
      KeyType: key.KeyType,
    }));

    // Log the extracted details
    console.log(
      `Attribute Definitions for '${tableName}':`,
      attributeDefinitions
    );
    console.log(`Key Schema for '${tableName}':`, keySchema);

    // Use the extracted details to create the table
    const createTableParams = {
      TableName: tableName,
      AttributeDefinitions: attributeDefinitions,
      KeySchema: keySchema,
      ProvisionedThroughput: {
        ReadCapacityUnits: 5, // Adjust as needed
        WriteCapacityUnits: 5, // Adjust as needed
      },
    };

    // Try to create the table
    await dynamodbClient.send(new CreateTableCommand(createTableParams));
    console.log(`Table '${tableName}' created successfully.`);
  } catch (error) {
    console.error(`Error creating table '${tableName}':`, error.message);
  }
};

const restoreTable = async (tableName, backupFileName) => {
  try {
    const backupData = fs.readFileSync(backupFileName, "utf-8");
    console.log('BAKCUP', backupData)
    const { data } = JSON.parse(backupData);
    if (!checkTableExists(tableName)) {
      // Create the table before restoring data
      await createTable(tableName);
    }
    const items = Object.values(data);
    Console.log('ITEMS: ', items)
    
    for (const item of items) {
      const putParams = {
        TableName: tableName,
        Item: item,
      };

      await dynamodbClient.send(new PutItemCommand(putParams));
    }

    console.log(`Data restored to table '${tableName}' from ${backupFileName}`);
  } catch (error) {
    console.error(
      `Error restoring data to table '${tableName}':`,
      error.message
    );
  }
};

const checkTableExists = async (tableName) => {
  try {
    const describeTableParams = {
      TableName: tableName,
    };

    await dynamodbClient.send(new DescribeTableCommand(describeTableParams));
    return true;
  } catch (error) {
    if (error.name === "ResourceNotFoundException") {
      // Table does not exist
      return false;
    }

    console.error(
      `Error checking table existence for '${tableName}':`,
      error.message
    );
    throw error;
  }
};

const restoreAll = async (dataSet) => {
  for (const tableName of dataSet) {
    const backupFileName = `${tableName}_backup.json`;

    console.log("Restoring data to table:", tableName);
    console.log("Restoring  filename:", backupFileName);
    

    await restoreTable(tableName, backupFileName);
  }
};

// Command line options
const argv = yargs(process.argv.slice(2))
  .command("backup", "Backup all tables", {}, () => backupAll(tableNames))
  .command("restore", "Restore all tables", {}, () => restoreAll(tableNames))
  .command("delete", "Delete all tables", {}, () => deleteAll(tableNames))
  .help().argv;

// If no command is provided, show help
// if (!argv._.length) {
//   yargs.showHelp();
// }
