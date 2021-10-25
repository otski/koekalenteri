aws dynamodb create-table `
  --table-name event-table `
  --attribute-definitions AttributeName=id,AttributeType=S `
  --key-schema AttributeName=id,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST --endpoint-url http://127.0.0.1:8000

aws dynamodb put-item --table-name event-table --item file://event-dynamodb.json --endpoint-url http://127.0.0.1:8000
