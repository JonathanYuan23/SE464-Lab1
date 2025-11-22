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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dynamo_db_1 = __importDefault(require("./dbs/dynamo_db"));
const mysql_db_1 = __importDefault(require("./dbs/mysql_db"));
const grpcServer_1 = __importDefault(require("./servers/grpcServer"));
const restServer_1 = __importDefault(require("./servers/restServer"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.argv.length < 4) {
            console.error("Not enough command line arguments!");
            throw new Error("Not enough command line arguments!");
        }
        dotenv_1.default.config();
        const db_choice = process.argv[3];
        let db;
        switch (db_choice) {
            case "dynamo":
                db = new dynamo_db_1.default();
                break;
            case "mysql": {
                const mysqlDb = new mysql_db_1.default();
                yield mysqlDb.init();
                db = mysqlDb;
                break;
            }
            default:
                console.error("Invalid database choice! (Must be dynamo or mysql)");
                throw new Error("Invalid database choice! (Must be dynamo or mysql)");
        }
        const server_choice = process.argv[2];
        let server;
        switch (server_choice) {
            case "rest":
                server = new restServer_1.default(db);
                break;
            case "grpc":
                server = new grpcServer_1.default(db);
                break;
            default:
                console.error("Invalid server choice! (Must be rest or grpc)");
                throw new Error("Invalid server choice! (Must be rest or grpc)");
        }
        server.start();
    });
}
main().catch((err) => {
    console.error("Fatal error starting app:", err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map