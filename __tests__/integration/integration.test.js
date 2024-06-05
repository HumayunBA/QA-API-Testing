const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const server = require('./server'); 
const database = require('./database'); 

describe('Product Logic Integration Tests', () => {
  before((done) => {
    // Initialize the database or clean it up before running tests
    database.query('DELETE FROM products', (err) => {
      if (err) return done(err);
      done();
    });
  });

  describe('GET /api/products', () => {
    it('should fetch all products successfully', (done) => {
      request(server)
        .get('/api/products')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /api/create', () => {
    it('should create a product successfully', (done) => {
      request(server)
        .post('/api/create')
        .send({
          name: 'Product B',
          description: 'Description B',
          price: 10.0,
          quantity: 100,
          category: 'Category B'
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal('Product created');
          done();
        });
    });

    it('should handle bad request when creating a product', (done) => {
      request(server)
        .post('/api/create')
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal('Bad Request');
          done();
        });
    });
  });

  describe('GET /api/product/:id', () => {
    it('should fetch product by ID successfully', (done) => {
      request(server)
        .post('/api/create')
        .send({
          name: 'Product C',
          description: 'Description C',
          price: 20.0,
          quantity: 200,
          category: 'Category C'
        })
        .end((err, res) => {
          if (err) return done(err);

          request(server)
            .get('/api/product/1') // Assuming the ID of the first product is 1
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).to.be.an('object');
              expect(res.body.name).to.equal('Product C');
              done();
            });
        });
    });

    it('should return 404 if product not found', (done) => {
      request(server)
        .get('/api/product/999')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal('Product not found');
          done();
        });
    });
  });

  describe('POST /api/delete/:id', () => {
    it('should delete product by ID successfully', (done) => {
      request(server)
        .post('/api/delete/1')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal('Product deleted');
          done();
        });
    });

    it('should return 404 if product not found when deleting by ID', (done) => {
      request(server)
        .post('/api/delete/999')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal('Product not found');
          done();
        });
    });
  });

  describe('POST /api/deleteall', () => {
    it('should delete all products successfully', (done) => {
      request(server)
        .post('/api/deleteall')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal('All products deleted');
          done();
        });
    });
  });

  // Add more tests for other endpoints similarly...
});
