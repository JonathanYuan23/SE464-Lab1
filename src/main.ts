import dotenv from "dotenv";
import DynamoDB from "./dbs/dynamo_db";
import MySqlDB from "./dbs/mysql_db";
import { IDatabase, IServer } from "./interfaces";
import GrpcServer from "./servers/grpcServer";
import RestServer from "./servers/restServer";

async function main() {
  if (process.argv.length < 4) {
    console.error("Not enough command line arguments!");
    throw new Error("Not enough command line arguments!");
  }

  dotenv.config();

  const db_choice = process.argv[3];
  let db: IDatabase;

  switch (db_choice) {
    case "dynamo":
      db = new DynamoDB();
      break;
    case "mysql": {
      const mysqlDb = new MySqlDB();
      await mysqlDb.init();
      db = mysqlDb;
      break;
    }
    default:
      console.error("Invalid database choice! (Must be dynamo or mysql)");
      throw new Error("Invalid database choice! (Must be dynamo or mysql)");
  }

  const server_choice = process.argv[2];
  let server: IServer;

  switch (server_choice) {
    case "rest":
      server = new RestServer(db);
      break;
    case "grpc":
      server = new GrpcServer(db);
      break;
    default:
      console.error("Invalid server choice! (Must be rest or grpc)");
      throw new Error("Invalid server choice! (Must be rest or grpc)");
  }

  server.start();
}

main().catch((err) => {
  console.error("Fatal error starting app:", err);
  process.exit(1);
});
