const express = require('express');
const bodyParser = require('body-parser');
const logic = require('./logic');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Routes

app.get('/api/products', logic.getAllProducts);
app.get('/api/products/:id', logic.getProductById);
app.get('/api/products/search/:character', logic.findProductsByCharacterMatch);
app.post('/api/products', logic.createProduct);
app.put('/api/products/:id', logic.editProductById);
app.delete('/api/products/:id', logic.deleteProductById);
app.delete('/api/products', logic.deleteAllProducts);




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
