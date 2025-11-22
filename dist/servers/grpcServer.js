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
const app_1 = require("../compiled_proto/app");
const logger_1 = __importDefault(require("../logger"));
const nice_grpc_1 = require("nice-grpc");
class GrpcServiceImpl {
    constructor(db) {
        this.requestCount = 0;
        this.db = db;
    }
    getProduct(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC getProduct - request: ${JSON.stringify(request)}`);
            const product = yield this.db.queryProductById(request.productId);
            return product;
        });
    }
    getRandomProduct(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC getRandomProduct - request: ${JSON.stringify(request)}`);
            const product = yield this.db.queryRandomProduct();
            return product;
        });
    }
    getAllProducts(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC getAllProducts - request: ${JSON.stringify(request)}`);
            const products = yield this.db.queryAllProducts(request.categoryId);
            return { products };
        });
    }
    getAllCategories(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC getAllCategories - request: ${JSON.stringify(request)}`);
            const categories = yield this.db.queryAllCategories();
            return { categories };
        });
    }
    getAllOrders(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC getAllOrders - request: ${JSON.stringify(request)}`);
            const orders = yield this.db.queryAllOrders();
            return { orders };
        });
    }
    getAllUserOrders(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC getAllUserOrders - request: ${JSON.stringify(request)}`);
            const orders = yield this.db.queryOrdersByUser(request.id);
            return { orders };
        });
    }
    getOrder(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC getOrder - request: ${JSON.stringify(request)}`);
            const order = yield this.db.queryOrderById(request.id);
            return order;
        });
    }
    getUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC getUser - request: ${JSON.stringify(request)}`);
            const user = yield this.db.queryUserById(request.id);
            return user;
        });
    }
    getAllUsers(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC getAllUsers - request: ${JSON.stringify(request)}`);
            const users = yield this.db.queryAllUsers();
            return { users };
        });
    }
    postOrder(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC postOrder - request: ${JSON.stringify(request)}`);
            yield this.db.insertOrder(request);
            return request;
        });
    }
    patchAccountDetails(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC patchAccountDetails - request: ${JSON.stringify(request)}`);
            yield this.db.updateUser(request);
            const user = yield this.db.queryUserById(request.id);
            return user;
        });
    }
    deleteOrder(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming gRPC deleteOrder - request: ${JSON.stringify(request)}`);
            const { id } = request;
            try {
                yield this.db.deleteOrder(id);
                return {}; // EmptyResponse
            }
            catch (error) {
                throw error;
            }
        });
    }
}
;
class GrpcServer {
    constructor(db) {
        this.db = db;
        this.server = (0, nice_grpc_1.createServer)();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const port = 3001;
            this.server.add(app_1.AppDefinition, new GrpcServiceImpl(this.db));
            yield this.server.listen(`0.0.0.0:${port}`);
            logger_1.default.info(`gRPC server listening on port ${port}`);
        });
    }
}
exports.default = GrpcServer;
;
//# sourceMappingURL=grpcServer.js.map