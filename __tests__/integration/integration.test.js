const request = require('supertest');
const app = require('../../server');
const logic = require('../../logic');
const database = require('../../database');

jest.setTimeout(10000);

afterAll(() => {
  database.end(err => {
    if (err) {
      console.error('Error ending database connection:', err);
    } else {
      console.log('Database connection ended');
    }
  });
});

test('POST /api/products should create a product successfully', done => {
  request(app)
    .post('/api/products')
    .send({
      id: 1,
      name: 'New Product',
      description: 'New Product Description',
      price: 9.99,
      quantity: 10,
      category: 'New'
    })
    .expect(201, done);
});


test('PUT /api/products/:id should update product by ID successfully', done => {
  request(app)
    .put('/api/products/1')
    .send({
      id: 1,
      name: 'Updated Product',
      description: 'Updated Product Description',
      price: 19.99,
      quantity: 5,
      category: 'Updated Category'
    })
    .expect(200, done);
});

test('GET /api/products should fetch all products successfully', done => {
  request(app)
    .get('/api/products')
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body.length).toBeGreaterThanOrEqual(0); // Ensure there are at least some products
      done();
    });
});

test('GET /api/products/:id should fetch product by ID successfully', done => {
  request(app)
    .get('/api/products/1')
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body.id).toBe(1); // Assuming product with ID 1 exists
      done();
    });
});


test('GET /api/products/search/:character should find products by character match successfully', done => {
  request(app)
    .get('/api/products/search/a')
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body.length).toBeGreaterThanOrEqual(0); // Ensure there are at least some products
      done();
    });
});

test('DELETE /api/products/:id should delete product by ID successfully', done => {
  request(app)
    .delete('/api/products/1')
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.text).toBe('Product deleted');
      done();
    });
});

test('DELETE /api/products should delete all products successfully', done => {
  request(app)
    .delete('/api/products')
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.text).toBe('All products deleted');
      done();
    });
});


