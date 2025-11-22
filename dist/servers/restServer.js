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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const logger_1 = __importDefault(require("../logger"));
class RestServer {
    constructor(db) {
        this.requestCount = 0;
        this.db = db;
        this.server = (0, express_1.default)();
    }
    start() {
        const port = 3000;
        this.server.use((0, cors_1.default)());
        this.server.use((0, morgan_1.default)("tiny"));
        this.server.use(body_parser_1.default.json());
        this.server.get("/", (req, res) => {
            // don't increment request count for health check
            logger_1.default.info(`[Request (Health Check)] Incoming GET / - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            res.send("Hello, World!");
        });
        this.server.get("/product/:productId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming GET /product/:productId - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            const { productId } = req.params;
            if (!productId) {
                res.status(400).send("No product id provided");
                return;
            }
            const product = yield this.db.queryProductById(productId);
            res.send(product);
        })); // Gets a product by product id
        this.server.get("/randomproduct", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming GET /randomproduct - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            try {
                const randProd = yield this.db.queryRandomProduct();
                res.send(randProd);
            }
            catch (error) {
                logger_1.default.error(`Error fetching random product:`, error);
                res.status(500).send({ error: 'Failed to fetch random product' });
            }
        })); // I'm feeling lucky type
        this.server.get("/products", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming GET /products - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            const { categoryId } = req.query;
            const products = yield this.db.queryAllProducts(categoryId);
            res.send(products);
        })); // Gets all products, or by category
        this.server.get("/categories", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming GET /categories - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            const categories = yield this.db.queryAllCategories();
            res.send(categories);
        })); // Gets all categories
        this.server.get("/allorders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming GET /allorders - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            const orders = yield this.db.queryAllOrders();
            res.send(orders);
        })); // Gets all orders
        this.server.get("/orders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming GET /orders - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            const { id } = req.query;
            if (!id) {
                res.status(400).send("No user id provided");
                return;
            }
            const orders = yield this.db.queryOrdersByUser(id);
            res.send(orders);
        })); // Gets all of a single user's orders
        this.server.get("/order/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming GET /order/:id - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            const { id } = req.params;
            if (!id) {
                res.status(400).send("No order id provided");
                return;
            }
            const order = yield this.db.queryOrderById(id);
            res.send(order);
        })); // Gets more details on a specific order by id
        this.server.get("/user/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming GET /user/:id - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            const { id } = req.params;
            if (!id) {
                res.status(400).send("No user id provided");
                return;
            }
            const user = yield this.db.queryUserById(id);
            res.send(user);
        })); // Gets details on a specific user by username
        this.server.get("/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming GET /users - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            const users = yield this.db.queryAllUsers();
            res.send(users);
        })); // Gets all users
        this.server.post("/orders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming POST /orders - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}, body: ${JSON.stringify(req.body)}`);
            const order = req.body;
            const response = yield this.db.insertOrder(order);
            res.send(response);
        })); // Creates a new order
        this.server.patch("/user/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming PATCH /user/:id - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}, body: ${JSON.stringify(req.body)}`);
            const updates = req.body;
            const userId = req.params.id;
            const patch = Object.assign(Object.assign({}, updates), { id: userId });
            const response = yield this.db.updateUser(patch);
            res.send(response);
        })); // Updates a user's email or password
        this.server.delete("/order/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.requestCount++;
            logger_1.default.info(`[Request #${this.requestCount}] Incoming DELETE /order/:id - params: ${JSON.stringify(req.params)}, query: ${JSON.stringify(req.query)}`);
            const { id } = req.params;
            if (!id) {
                res.status(400).send("No order id provided");
                return;
            }
            try {
                yield this.db.deleteOrder(id);
                res.status(204).send(); // No Content
            }
            catch (error) {
                logger_1.default.error(`Error deleting order with id ${id}:`, error);
                res.status(500).send({ error: 'Failed to delete order' });
            }
        })); // Deletes an order by id
        this.server.listen(port, () => {
            logger_1.default.info(`REST server listening on port ${port}`);
        });
    }
}
exports.default = RestServer;
//# sourceMappingURL=restServer.js.map