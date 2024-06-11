const database = require('../../database'); // Adjust the path as necessary
const logic = require('../../logic');

// Mock the database module
jest.mock('../../database', () => ({
  query: jest.fn()
}));

describe('Product Logic', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls and instances between tests
  });

  describe('getAllProducts', () => {
    it('should fetch all products successfully', () => {
      const products = [{ id: 1, name: 'Product A' }];
      database.query.mockImplementation((query, callback) => {
        callback(null, products);
      });

      logic.getAllProducts(req, res);

      expect(database.query).toHaveBeenCalledWith('SELECT * FROM products', expect.any(Function));
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it('should handle error when fetching all products', () => {
      const error = new Error('Database error');
      database.query.mockImplementation((query, callback) => {
        callback(error, null);
      });

      logic.getAllProducts(req, res);

      expect(database.query).toHaveBeenCalledWith('SELECT * FROM products', expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to fetch products');
    });
  });

  describe('createProduct', () => {
    it('should create a product successfully', () => {
      req.body = {
        id: 1,
        name: 'Product B',
        description: 'Description B',
        price: 10.0,
        quantity: 100,
        category: 'Category B'
      };

      database.query.mockImplementation((query, params, callback) => {
        callback(null, { insertId: 1 });
      });

      logic.createProduct(req, res);

      expect(database.query).toHaveBeenCalledWith(
        'INSERT INTO products (id, name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.id, req.body.name, req.body.description, req.body.price, req.body.quantity, req.body.category],
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('Product created');
    });

    it('should handle error when creating a product', () => {
      req.body = {
        id: 1,
        name: 'Product B',
        description: 'Description B',
        price: 10.0,
        quantity: 100,
        category: 'Category B'
      };
      const error = new Error('Database error');
      database.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      logic.createProduct(req, res);

      expect(database.query).toHaveBeenCalledWith(
        'INSERT INTO products (id, name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.id, req.body.name, req.body.description, req.body.price, req.body.quantity, req.body.category],
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error creating product');
    });

    it('should handle bad request when creating a product', () => {
      req.body = {};

      logic.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Bad Request');
    });
  });

  describe('getProductById', () => {
    it('should fetch product by ID successfully', () => {
      req.params.id = 1;
      const product = { id: 1, name: 'Product A' };
      database.query.mockImplementation((query, params, callback) => {
        callback(null, [product]);
      });

      logic.getProductById(req, res);

      expect(database.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id = ?', [req.params.id], expect.any(Function));
      expect(res.json).toHaveBeenCalledWith(product);
    });

    it('should handle error when fetching product by ID', () => {
      req.params.id = 1;
      const error = new Error('Database error');
      database.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      logic.getProductById(req, res);

      expect(database.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id = ?', [req.params.id], expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to fetch product');
    });

    it('should return 404 if product not found', () => {
      req.params.id = 1;
      database.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      logic.getProductById(req, res);

      expect(database.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id = ?', [req.params.id], expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Product not found');
    });
  });

  describe('deleteAllProducts', () => {
    it('should delete all products successfully', () => {
      database.query.mockImplementation((query, callback) => {
        callback(null, { affectedRows: 10 });
      });

      logic.deleteAllProducts(req, res);

      expect(database.query).toHaveBeenCalledWith('DELETE FROM products', expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('All products deleted');
    });

    it('should handle error when deleting all products', () => {
      const error = new Error('Database error');
      database.query.mockImplementation((query, callback) => {
        callback(error, null);
      });

      logic.deleteAllProducts(req, res);

      expect(database.query).toHaveBeenCalledWith('DELETE FROM products', expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error deleting products');
    });
  });

  describe('deleteProductById', () => {
    it('should delete product by ID successfully', () => {
      req.params.id = 1;
      database.query.mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      logic.deleteProductById(req, res);

      expect(database.query).toHaveBeenCalledWith('DELETE FROM products WHERE id = ?', [req.params.id], expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Product deleted');
    });

    it('should handle error when deleting product by ID', () => {
      req.params.id = 1;
      const error = new Error('Database error');
      database.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      logic.deleteProductById(req, res);

      expect(database.query).toHaveBeenCalledWith('DELETE FROM products WHERE id = ?', [req.params.id], expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to delete product');
    });

    it('should return 404 if product not found when deleting by ID', () => {
      req.params.id = 1;
      database.query.mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 0 });
      });

      logic.deleteProductById(req, res);

      expect(database.query).toHaveBeenCalledWith('DELETE FROM products WHERE id = ?', [req.params.id], expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Product not found');
    });
  });

  describe('editProductById', () => {
    it('should update product by ID successfully', () => {
      req.params.id = 1;
      req.body = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20.0,
        quantity: 200,
        category: 'Updated Category'
      };

      database.query.mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      logic.editProductById(req, res);

      expect(database.query).toHaveBeenCalledWith(
        'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?',
        [
          req.body.name,
          req.body.description,
          req.body.price,
          req.body.quantity,
          req.body.category,
          req.params.id
        ],
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Product updated');
    });

    it('should handle error when updating product by ID', () => {
      req.params.id = 1;
      req.body = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20.0,
        quantity: 200,
        category: 'Updated Category'
      };
      const error = new Error('Database error');
      database.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      logic.editProductById(req, res);

      expect(database.query).toHaveBeenCalledWith(
        'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?',
        [
          req.body.name,
          req.body.description,
          req.body.price,
          req.body.quantity,
          req.body.category,
          req.params.id
        ],
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to update product');
    });

    it('should return 404 if product not found when updating by ID', () => {
      req.params.id = 1;
      req.body = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20.0,
        quantity: 200,
        category: 'Updated Category'
      };
      database.query.mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 0 });
      });

      logic.editProductById(req, res);

      expect(database.query).toHaveBeenCalledWith(
        'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?',
        [
          req.body.name,
          req.body.description,
          req.body.price,
          req.body.quantity,
          req.body.category,
          req.params.id
        ],
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Product not found');
    });
  });

  describe('findProductsByCharacterMatch', () => {
    it('should fetch products by character match successfully', () => {
      req.params.character = 'A';
      const products = [{ id: 1, name: 'Product A' }];
      database.query.mockImplementation((query, params, callback) => {
        callback(null, products);
      });

      logic.findProductsByCharacterMatch(req, res);

      expect(database.query).toHaveBeenCalledWith('SELECT * FROM products WHERE name LIKE ?', [`%${req.params.character}%`], expect.any(Function));
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it('should handle error when fetching products by character match', () => {
      req.params.character = 'A';
      const error = new Error('Database error');
      database.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      logic.findProductsByCharacterMatch(req, res);

      expect(database.query).toHaveBeenCalledWith('SELECT * FROM products WHERE name LIKE ?', [`%${req.params.character}%`], expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to fetch products');
    });
  });
});
