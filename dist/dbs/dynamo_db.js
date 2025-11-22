"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoDB {
    constructor() {
        const client = new client_dynamodb_1.DynamoDBClient({ region: process.env.AWS_REGION });
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
        console.log("DynamoDB connected!");
    }
    ;
    queryRandomProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            // Scan all products first
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: "Products",
            });
            const response = yield this.docClient.send(command);
            const products = response.Items;
            // Select a random product from the results
            if (products && products.length > 0) {
                const randomIndex = Math.floor(Math.random() * products.length);
                return products[randomIndex];
            }
            return null;
        });
    }
    ;
    queryProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.GetCommand({
                TableName: "Products",
                Key: {
                    id: productId,
                },
            });
            const response = yield this.docClient.send(command);
            return response.Item;
        });
    }
    ;
    queryAllProducts(category) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create scan command, optionally with filter for category
            const command = new lib_dynamodb_1.ScanCommand(Object.assign({ TableName: "Products" }, (category && {
                FilterExpression: "categoryId = :categoryId",
                ExpressionAttributeValues: {
                    ":categoryId": category,
                },
            })));
            const response = yield this.docClient.send(command);
            return response.Items;
        });
    }
    ;
    queryAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: "Categories",
            });
            const response = yield this.docClient.send(command);
            return response.Items;
        });
    }
    ;
    queryAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: "Orders",
            });
            const response = yield this.docClient.send(command);
            return response.Items;
        });
    }
    ;
    queryOrdersByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: "Orders",
                FilterExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": userId,
                },
            });
            const response = yield this.docClient.send(command);
            return response.Items;
        });
    }
    ;
    queryOrderById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.GetCommand({
                TableName: "Orders",
                Key: {
                    id: userId,
                },
            });
            const response = yield this.docClient.send(command);
            return response.Item;
        });
    }
    ;
    queryUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.GetCommand({
                TableName: "Users",
                Key: {
                    id: userId,
                },
                ProjectionExpression: 'id, #n, email',
                ExpressionAttributeNames: { "#n": "name" },
            });
            const response = yield this.docClient.send(command);
            return response.Item;
        });
    }
    ;
    queryAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: "Users",
                ProjectionExpression: 'id, #n, email',
                ExpressionAttributeNames: { "#n": "name" },
            });
            const response = yield this.docClient.send(command);
            return response.Items;
        });
    }
    ;
    insertOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.PutCommand({
                TableName: "Orders",
                Item: order,
            });
            yield this.docClient.send(command);
        });
    }
    updateUser(patch) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateExpressions = [];
            const expressionAttributeValues = {};
            const expressionAttributeNames = {};
            // Build update expressions based on what's in the patch
            if (patch.email) {
                updateExpressions.push('#email = :email');
                expressionAttributeValues[':email'] = patch.email;
                expressionAttributeNames['#email'] = 'email';
            }
            if (patch.password) {
                updateExpressions.push('#password = :password');
                expressionAttributeValues[':password'] = patch.password;
                expressionAttributeNames['#password'] = 'password';
            }
            // Only perform update if there's something to update
            if (updateExpressions.length > 0) {
                const command = new lib_dynamodb_1.UpdateCommand({
                    TableName: "Users",
                    Key: {
                        id: patch.id,
                    },
                    UpdateExpression: `set ${updateExpressions.join(', ')}`,
                    ExpressionAttributeValues: expressionAttributeValues,
                    ExpressionAttributeNames: expressionAttributeNames,
                });
                yield this.docClient.send(command);
            }
        });
    }
    ;
    // This is to delete the inserted order to avoid database data being contaminated also to make the data in database consistent with that in the json files so the comparison will return true.
    // Feel free to modify this based on your inserOrder implementation
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.DeleteCommand({
                TableName: "Orders",
                Key: {
                    id: id,
                },
            });
            yield this.docClient.send(command);
        });
    }
    ;
}
exports.default = DynamoDB;
;
//# sourceMappingURL=dynamo_db.js.map