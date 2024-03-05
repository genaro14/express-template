#!/bin/bash
#|--------------------------------------------------------------------------------------------------------------------|
#| Script para automatizar la eliminacion de Tablas de dynamodb local en contendor docker                             |
#| Dar permisos y ejecutar, los nombres de las tablas se encuentran en el archivo js                                  |   
#|--------------------------------------------------------------------------------------------------------------------|

# Ejemplo manual
# docker exec --user root -it dynamodb-local sh -c "aws dynamodb delete-table --table-name crossmark_metadada --endpoint-url http://localhost:8000";
# docker exec --user root -it dynamodb-local sh -c "aws dynamodb delete-table --table-name crossmark --endpoint-url http://localhost:8000";
# docker exec --user root -it dynamodb-local sh -c "aws dynamodb delete-table --table-name crossmark_retailers_info --endpoint-url http://localhost:8000";
# docker exec --user root -it dynamodb-local sh -c "aws dynamodb delete-table --table-name highscore_ --endpoint-url http://localhost:8000";

# Ejemplo con aws-cli
#docker exec --user root -i dynamodb-local sh -c "aws dynamodb delete-table --cli-input-json file:///home/dynamodblocal/delete_tables.json --endpoint-url http://localhost:8000"


# Dependencies
# docker exec --user root -it dynamodb-local sh -c "yum install -y nodejs";
# docker exec --user root -it dynamodb-local sh -c "npm install aws-sdk";
# docker exec --user root -it dynamodb-local sh -c npm install @aws-sdk/client-dynamodb;


# Extract table names using jq
table_list=$(docker exec --user root -it dynamodb-local sh -c "aws dynamodb list-tables --endpoint-url http://localhost:8000 | jq -r '.TableNames[]'")
echo "Table List:" $table_list 
echo "copy file >>> deleteTables" 
docker cp ./delete_Tables/deleteTables.js dynamodb-local:/home/dynamodblocal/deleteTables.js
echo "Running Deletion >>> " 
docker exec --user root -it dynamodb-local sh -c "node deleteTables.js";





