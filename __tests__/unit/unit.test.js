const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const database = require('../database'); // Adjust the path as necessary
const logic = require('../logic');

describe('Product Logic', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { params: {}, body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAllProducts', () => {
    it('should fetch all products successfully', (done) => {
      const products = [{ id: 1, name: 'Product A' }];
      sandbox.stub(database, 'query').callsFake((query, callback) => {
        callback(null, products);
      });

      logic.getAllProducts(req, res);

      expect(database.query.calledWith('SELECT * FROM products')).to.be.true;
      expect(res.json.calledWith(products)).to.be.true;
      done();
    });

    it('should handle error when fetching all products', (done) => {
      const error = new Error('Database error');
      sandbox.stub(database, 'query').callsFake((query, callback) => {
        callback(error, null);
      });

      logic.getAllProducts(req, res);

      expect(database.query.calledWith('SELECT * FROM products')).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('Failed to fetch products')).to.be.true;
      done();
    });
  });

  describe('createProduct', () => {
    it('should create a product successfully', (done) => {
      req.body = {
        name: 'Product B',
        description: 'Description B',
        price: 10.0,
        quantity: 100,
        category: 'Category B'
      };

      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(null, { insertId: 1 });
      });

      logic.createProduct(req, res);

      expect(database.query.calledWith(
        'INSERT INTO products (name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?)',
        [req.body.name, req.body.description, req.body.price, req.body.quantity, req.body.category]
      )).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.send.calledWith('Product created')).to.be.true;
      done();
    });

    it('should handle error when creating a product', (done) => {
      req.body = {
        name: 'Product B',
        description: 'Description B',
        price: 10.0,
        quantity: 100,
        category: 'Category B'
      };
      const error = new Error('Database error');
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(error, null);
      });

      logic.createProduct(req, res);

      expect(database.query.calledWith(
        'INSERT INTO products (name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?)',
        [req.body.name, req.body.description, req.body.price, req.body.quantity, req.body.category]
      )).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('Error creating product')).to.be.true;
      done();
    });

    it('should handle bad request when creating a product', (done) => {
      req.body = {};

      logic.createProduct(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith('Bad Request')).to.be.true;
      done();
    });
  });

  describe('getProductById', () => {
    it('should fetch product by ID successfully', (done) => {
      req.params.id = 1;
      const product = { id: 1, name: 'Product A' };
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(null, [product]);
      });

      logic.getProductById(req, res);

      expect(database.query.calledWith('SELECT * FROM products WHERE id = ?', [req.params.id])).to.be.true;
      expect(res.json.calledWith(product)).to.be.true;
      done();
    });

    it('should handle error when fetching product by ID', (done) => {
      req.params.id = 1;
      const error = new Error('Database error');
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(error, null);
      });

      logic.getProductById(req, res);

      expect(database.query.calledWith('SELECT * FROM products WHERE id = ?', [req.params.id])).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('Failed to fetch product')).to.be.true;
      done();
    });

    it('should return 404 if product not found', (done) => {
      req.params.id = 1;
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(null, []);
      });

      logic.getProductById(req, res);

      expect(database.query.calledWith('SELECT * FROM products WHERE id = ?', [req.params.id])).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith('Product not found')).to.be.true;
      done();
    });
  });

  describe('deleteAllProducts', () => {
    it('should delete all products successfully', (done) => {
      sandbox.stub(database, 'query').callsFake((query, callback) => {
        callback(null, { affectedRows: 10 });
      });

      logic.deleteAllProducts(req, res);

      expect(database.query.calledWith('DELETE FROM products')).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith('All products deleted')).to.be.true;
      done();
    });

    it('should handle error when deleting all products', (done) => {
      const error = new Error('Database error');
      sandbox.stub(database, 'query').callsFake((query, callback) => {
        callback(error, null);
      });

      logic.deleteAllProducts(req, res);

      expect(database.query.calledWith('DELETE FROM products')).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('Error deleting products')).to.be.true;
      done();
    });
  });

  describe('deleteProductById', () => {
    it('should delete product by ID successfully', (done) => {
      req.params.id = 1;
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      logic.deleteProductById(req, res);

      expect(database.query.calledWith('DELETE FROM products WHERE id = ?', [req.params.id])).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith('Product deleted')).to.be.true;
      done();
    });

    it('should handle error when deleting product by ID', (done) => {
      req.params.id = 1;
      const error = new Error('Database error');
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(error, null);
      });

      logic.deleteProductById(req, res);

      expect(database.query.calledWith('DELETE FROM products WHERE id = ?', [req.params.id])).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('Failed to delete product')).to.be.true;
      done();
    });

    it('should return 404 if product not found when deleting by ID', (done) => {
      req.params.id = 1;
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(null, { affectedRows: 0 });
      });

      logic.deleteProductById(req, res);

      expect(database.query.calledWith('DELETE FROM products WHERE id = ?', [req.params.id])).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith('Product not found')).to.be.true;
      done();
    });
  });

  describe('editProductById', () => {
    it('should update product by ID successfully', (done) => {
      req.params.id = 1;
      req.body = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20.0,
        quantity: 200,
        category: 'Updated Category'
      };

      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      logic.editProductById(req, res);

      expect(database.query.calledWith(
        'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?',
        [
          req.body.name,
          req.body.description,
          req.body.price,
          req.body.quantity,
          req.body.category,
          req.params.id
        ]
      )).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith('Product updated')).to.be.true;
      done();
    });

    it('should handle error when updating product by ID', (done) => {
      req.params.id = 1;
      req.body = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20.0,
        quantity: 200,
        category: 'Updated Category'
      };
      const error = new Error('Database error');
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(error, null);
      });

      logic.editProductById(req, res);

      expect(database.query.calledWith(
        'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?',
        [
          req.body.name,
          req.body.description,
          req.body.price,
          req.body.quantity,
          req.body.category,
          req.params.id
        ]
      )).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('Failed to update product')).to.be.true;
      done();
    });

    it('should return 404 if product not found when updating by ID', (done) => {
      req.params.id = 1;
      req.body = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20.0,
        quantity: 200,
        category: 'Updated Category'
      };
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(null, { affectedRows: 0 });
      });

      logic.editProductById(req, res);

      expect(database.query.calledWith(
        'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?',
        [
          req.body.name,
          req.body.description,
          req.body.price,
          req.body.quantity,
          req.body.category,
          req.params.id
        ]
      )).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith('Product not found')).to.be.true;
      done();
    });
  });

  describe('findProductsByCharacterMatch', () => {
    it('should find products by character match successfully', (done) => {
      req.params.char = 'A';
      const products = [{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }];
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(null, products);
      });

      logic.findProductsByCharacterMatch(req, res);

      expect(database.query.calledWith('SELECT * FROM products WHERE name LIKE ?', [`%${req.params.char}%`])).to.be.true;
      expect(res.json.calledWith(products)).to.be.true;
      done();
    });

    it('should handle error when finding products by character match', (done) => {
      req.params.char = 'A';
      const error = new Error('Database error');
      sandbox.stub(database, 'query').callsFake((query, params, callback) => {
        callback(error, null);
      });

      logic.findProductsByCharacterMatch(req, res);

      expect(database.query.calledWith('SELECT * FROM products WHERE name LIKE ?', [`%${req.params.char}%`])).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('Failed to find products')).to.be.true;
      done();
    });
  });
});
