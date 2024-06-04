const express = require('express');
const bodyParser = require('body-parser');
const logic = require('./logic');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Routes

app.get('/api/products', logic.getAllUsers);
app.get('/api/product/:id', logic.getUserById);
app.get('/api/edit/:id', logic.editUserForm);
app.post('/api/update/:id', logic.updateUser);
app.post('/api/delete/:id', logic.deleteUser);
app.get('api/create', logic.createUserForm);
app.post('api/create', logic.createUser);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
