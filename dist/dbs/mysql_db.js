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
const promise_1 = __importDefault(require("mysql2/promise"));
const logger_1 = __importDefault(require("../logger"));
class MySqlDB {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield promise_1.default.createConnection({
                host: process.env.RDS_HOSTNAME,
                user: process.env.RDS_USERNAME,
                password: process.env.RDS_PASSWORD,
                port: parseInt(process.env.RDS_PORT), // Convert port to a number
                database: process.env.RDS_DATABASE,
            });
            logger_1.default.info("MySQL connected!");
        });
    }
    constructor() {
        this.queryAllProducts = (category) => __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            if (category) {
                return (yield this.connection.query('SELECT * FROM products WHERE categoryId = ?', [category]))[0];
            }
            return (yield this.connection.query('SELECT * FROM products;'))[0];
        });
        this.queryAllCategories = () => __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            return (yield this.connection.query("SELECT * FROM categories;"))[0];
        });
        this.queryAllOrders = () => __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            return (yield this.connection.query("SELECT * FROM orders;"))[0];
        });
        this.queryOrderById = (id) => __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            return (yield this.connection.query(`SELECT *
                             FROM orders
                             WHERE id = "${id}"`))[0][0];
        });
        this.queryUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            return (yield this.connection.query(`SELECT id, email, name
                             FROM users
                             WHERE id = "${id}";`))[0][0];
        });
        this.queryAllUsers = () => __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            return (yield this.connection.query("SELECT id, name, email FROM users"))[0];
        });
        this.insertOrder = (order) => __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            // Insert the order record
            yield this.connection.query('INSERT INTO orders (id, userId, totalAmount) VALUES (?, ?, ?)', [order.id, order.userId, order.totalAmount]);
        });
        this.updateUser = (patch) => __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            const updates = [];
            const values = [];
            if (patch.email) {
                updates.push('email = ?');
                values.push(patch.email);
            }
            if (patch.password) {
                updates.push('password = ?');
                values.push(patch.password);
            }
            if (updates.length === 0) {
                return; // Nothing to update
            }
            values.push(patch.id); // Add ID for the WHERE clause
            yield this.connection.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
        });
        // This is to delete the inserted order to avoid database data being contaminated also to make the data in database consistent with that in the json files so the comparison will return true.
        // Feel free to modify this based on your inserOrder implementation
        this.deleteOrder = (id) => __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            yield this.connection.query(`DELETE FROM order_items WHERE orderId = ?`, [id]);
            yield this.connection.query(`DELETE FROM orders WHERE id = ?`, [id]);
        });
        // Connection will be initialized via init() method
    }
    ensureConnection() {
        if (!this.connection) {
            logger_1.default.error("MySQL connection used before init()");
            throw new Error("MySQL connection not initialized");
        }
    }
    queryProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            return (yield this.connection.query(`SELECT *
                                FROM products
                                WHERE id = "${productId}";`))[0][0];
        });
    }
    ;
    queryRandomProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            // Define the SQL query explicitly as a variable for debugging
            const sql = 'SELECT * FROM products ORDER BY RAND() LIMIT 1;';
            logger_1.default.info('Executing random product query:', sql);
            try {
                const [rows] = yield this.connection.query(sql);
                logger_1.default.info('Query result rows:', Array.isArray(rows) ? rows.length : 0);
                // If no products, return null instead of undefined
                if (!rows || (Array.isArray(rows) && rows.length === 0)) {
                    logger_1.default.info('No products found in database');
                    return null;
                }
                return rows[0];
            }
            catch (error) {
                logger_1.default.error('Error executing random product query:', error);
                throw error;
            }
        });
    }
    ;
    queryOrdersByUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
            return (yield this.connection.query('SELECT * FROM orders WHERE userId = ?', [id]))[0];
        });
    }
    ;
}
exports.default = MySqlDB;
;
//# sourceMappingURL=mysql_db.js.map