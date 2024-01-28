const { Console } = require('console');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { connect } = require('http2');
const productsDB = require('./mongoDB.js');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());


app.get('/', async(request, response) => {
  console.log("Requete : /products/search, params : ", request.query);
  var body = {}
  body.success = true;

  var products = await productsDB.fetchProducts(null, null);
  var result = products;

  body.data = {}
  body.data.result = result;

  response.send(body);
});

app.get('/products/search', async (req, res) => {
  const limit = parseInt(req.query.limit) || 12;
  const brand = req.query.brand || undefined;
  const price = parseInt(req.query.price) || undefined;
  
  var products = await productsDB.fetchProducts(brand, price, true,false,false,limit);
  if(products == null){console.log('no product found');products='No product found';}

  res.send(products);
});

app.get('/products/*', async (req, res) => {
  console.log("Requete : products/:id, params : ", req.params[0]);
  var body = {}
  body.success = true;

  var id = req.params[0];

  var product = await productsDB.fetchProductsByUuid(id);

  body.data = {}
  body.data.result = product;

  res.send(body);
});

app.get('/brands', async (request, response) => {
  console.log("Requete : /brands, params : ", request.query);
  var body = {}
  body.success = true;

  var brands = await productsDB.getBrands();

  body.data = {}
  body.data.result = brands;
  response.send(body);
});



app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);