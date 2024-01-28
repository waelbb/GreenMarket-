const { connect } = require('http2');
const {MongoClient} = require('mongodb');
const fs = require('fs');
 
var MONGODB_URI = "mongodb+srv://waelbb:Odi06fLtHLCospXR@clearfashion.r3bto5h.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearFashion';
var client, db, collection;
 
async function connectToMongoDb(){
    console.log('Connecting to MongoDB ...');
    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    db =  client.db(MONGODB_DB_NAME)
    collection = db.collection('products');
}
 
async function insertProduct(){
    await connectToMongoDb();
    console.log('Pushing new products to MongoDB ...');
    let rawdata = fs.readFileSync('products.json');
    let products = JSON.parse(rawdata);
    products.map(product => {
        product._id = product.uuid;
        delete product.uuid;
    });
    const alreadyExist = await collection.find({}).toArray();
    console.log("a");
    products = products.filter(product => !alreadyExist.some(product2 => product2._id == product._id));
    if(products.length != 0)
    {
        const result = await collection.insertMany(products);
        console.log(result);
    }
    else
    {
        console.log("There is no new product");
    }
    //process.exit(0);
}
 
async function fetchProducts(brand = undefined, maxPrice = undefined, sortedByPrice = false, sortedByDate = false, scrapedLessThanTwoWeeksAgo = false,limit = 0){
    await connectToMongoDb();
    console.log('Fetching products from MongoDB ...');
    var result = "none";
    var query = {};
    if (brand != undefined) query.brand = brand;
    if (maxPrice != undefined) query.price = {$lt: maxPrice};
    result = await collection.find(query);
    if (sortedByPrice) result = result.sort({price: 1});
    if (sortedByDate) result = result.sort({scrapDate: -1});
    result = await result.limit(limit).toArray();
    if (scrapedLessThanTwoWeeksAgo) result = result.filter(product => new Date(product.scrapDate) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));
    return result;
    //process.exit(0);
}


async function fetchProductsByUuid(uuid) {
    await connectToMongoDb();
    console.log(`Fetching product with uuid=${uuid} from MongoDB ...`);
    const query = {_id: uuid};
    const result = await collection.findOne(query);
    //console.log(result);
    return result;
    //process.exit(0);
  }

  async function getBrands(){
    await connectToMongoDb();
    console.log('Fetching brands from MongoDB ...');
    var result = "none";
    result = await collection.distinct("brand");
    return result;
}
  
module.exports={
    fetchProducts,
    fetchProductsByUuid,
    getBrands
}

//insertProduct();