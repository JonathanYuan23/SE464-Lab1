import { Product } from "../compiled_proto/app";
import { IDatabase } from "../interfaces";
import { Category, Order, User, UserPatchRequest } from "../types";
import mysql from "mysql2/promise";

export default class MySqlDB implements IDatabase {
  connection: mysql.Connection;

  async init() {
    this.connection = await mysql.createConnection({
      host: process.env.RDS_HOSTNAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      port: parseInt(process.env.RDS_PORT), // Convert port to a number
      database: process.env.RDS_DATABASE,
    });
    console.log("MySQL connected!");
  }

  constructor() {
    this.init();
  }

  async queryProductById(productId) {
    return (await this.connection.query(`SELECT *
                                FROM products
                                WHERE id = "${productId}";`))[0][0] as Product;
  };

  async queryRandomProduct() {
    // Define the SQL query explicitly as a variable for debugging
    const sql = 'SELECT * FROM products ORDER BY RAND() LIMIT 1;';
    console.log('Executing random product query:', sql);
    
    try {
      const [rows] = await this.connection.query(sql);
      console.log('Query result rows:', Array.isArray(rows) ? rows.length : 0);
      
      // If no products, return null instead of undefined
      if (!rows || (Array.isArray(rows) && rows.length === 0)) {
        console.log('No products found in database');
        return null;
      }
      
      return rows[0] as Product;
    } catch (error) {
      console.error('Error executing random product query:', error);
      throw error;
    }
  };

  queryAllProducts = async (category?: string) => {
    if (category) {
      return (await this.connection.query('SELECT * FROM products WHERE categoryId = ?', [category]))[0] as Product[];
    }
    return (await this.connection.query('SELECT * FROM products;'))[0] as Product[];
  };

  queryAllCategories = async () => {
    return (await this.connection.query("SELECT * FROM categories;"))[0] as Category[];
  };

  queryAllOrders = async () => {
    return (await this.connection.query("SELECT * FROM orders;"))[0] as Order[];
  };

  async queryOrdersByUser(id: string) {
    return (
      await this.connection.query('SELECT * FROM orders WHERE userId = ?', [id])
    )[0] as Order[];
  };

  queryOrderById = async (id: string) => {
    return (
      await this.connection.query(`SELECT *
                             FROM orders
                             WHERE id = "${id}"`)
    )[0][0];
  };

  queryUserById = async (id: string) => {
    return (
      await this.connection.query(`SELECT id, email, name
                             FROM users
                             WHERE id = "${id}";`)
    )[0][0];
  };

  queryAllUsers = async () => {
    return (await this.connection.query("SELECT id, name, email FROM users"))[0] as User[];
  };

  insertOrder = async (order: Order) => {
    // Insert the order record
    await this.connection.query(
      'INSERT INTO orders (id, userId, totalAmount) VALUES (?, ?, ?)',
      [order.id, order.userId, order.totalAmount]
    );
  };

  updateUser = async (patch: UserPatchRequest) => {
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
    
    await this.connection.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  };

  // This is to delete the inserted order to avoid database data being contaminated also to make the data in database consistent with that in the json files so the comparison will return true.
  // Feel free to modify this based on your inserOrder implementation
  deleteOrder = async (id: string) => {
    await this.connection.query(
      `DELETE FROM order_items WHERE orderId = ?`,
      [id]
    );
    await this.connection.query(
      `DELETE FROM orders WHERE id = ?`,
      [id]
    );
  };
};