const database = require('./database');
const path = require('path');
const fs = require('fs');

const getAllProducts = (req, res) => {
  database.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Failed to fetch products');
    } else {
      res.json(results);
    }
  });
};

const createProduct = (req, res) => {
  const body = req.body;
  if (!body.id || !body.name || !body.description || !body.price || !body.quantity || !body.category) {
    res.status(400).send("Bad Request");
  } else {
    database.query('INSERT INTO products (id, name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?, ?)',
      [body.id, body.name, body.description, body.price, body.quantity, body.category], (err, result) => {
        if (err) {
          console.error('Error creating product:', err);
          res.status(500).send("Error creating product");
        } else {
          res.status(201).send("Product created");
        }
      });
  }
};


const getProductById = (req, res) => {
  const productID = req.params.id;
  database.query('SELECT * FROM products WHERE id = ?', [productID], (err, results) => {
    if (err) {
      console.error('Error fetching product by ID:', err);
      res.status(500).send('Failed to fetch product');
    } else if (results.length === 0) {
      res.status(404).send('Product not found');
    } else {
      res.json(results[0]);
    }
  });
};

const deleteAllProducts = (req, res) => {
  database.query("DELETE FROM products", (err, results) => {
    if (err) {
      console.error('Error deleting products:', err);
      res.status(500).send("Error deleting products");
    } else {
      res.status(200).send("All products deleted");
    }
  });
};

const deleteProductById = (req, res) => {
  const productid = req.params.id;
  database.query('DELETE FROM products WHERE id = ?', [productid], (err, results) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).send('Failed to delete product');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Product not found');
    } else {
      res.status(200).send('Product deleted');
    }
  });
};

const editProductById = (req, res) => {
  const productid = req.params.id;
  const body = req.body;
  const query = 'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?';
  database.query(query, [body.name, body.description, body.price, body.quantity, body.category, productid], (err, results) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).send('Failed to update product');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Product not found');
    } else {
      res.status(200).send('Product updated');
    }
  });
};

const findProductsByCharacterMatch = (req, res) => {
  const character = req.params.character;
  const query = 'SELECT * FROM products WHERE name LIKE ?';
  database.query(query, [`%${character}%`], (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Failed to fetch products');
    } else {
      res.json(results);
    }
  });
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  deleteAllProducts,
  deleteProductById,
  editProductById,
  findProductsByCharacterMatch
};
