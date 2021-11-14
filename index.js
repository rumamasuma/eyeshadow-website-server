const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const cors= require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qaigm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

try{

    await client.connect();
    const database = client.db("eyeShadowPalette");
    const productCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const reviewsCollection = database.collection("reviews");

    // GET products API
    app.get('/products', async(req, res)=>{
        const cursor = productCollection.find({});
        const products = await cursor.toArray();
        res.send(products);
    })
    // GET Single product
app.get('/products/:id' , async(req, res)=>{
    const id = req.params.id;
    // console.log('geeting single id');
    const query = {_id : ObjectId(id)};
    const product= await productCollection.findOne(query);
    res.json(product);

})
// POST product
app.post('/products' , async(req, res)=>{
  const product = req.body;
  const result= await productCollection.insertOne(product);
  res.json(result);
})
// delete product
app.delete('/products/:id', async(req, res)=>{
  const id = req.params.id;
  const query = {_id : ObjectId(id)};
  console.log(query);
  const result = await productCollection.deleteOne(query);
  res.json(result);
})
// order get by GET API
app.get('/orders', async(req, res)=>{
   const cursor = ordersCollection.find({});
   const orders = await cursor.toArray();
   res.json(orders);
})



// order send by POST API
 app.post('/orders', async(req, res) =>{
   const order = req.body;
  const result = await ordersCollection.insertOne(order);
  // console.log(result);
   res.json(result);
 })
 // DELETE API
app.delete('/orders/:id', async(req, res) =>{
  const id = req.params.id;
  const query = {_id : ObjectId(id)};
  // console.log(query);
  const result = await ordersCollection.deleteOne(query);
  res.json(result);
})
// review POST API
app.post('/reviews' , async(req, res)=>{
  const review = req.body;
  const result = await reviewsCollection.insertOne(review);
  res.json(result);
})
// user admin
app.get('/users/:email' , async(req,res)=>{
  const email = req.params.email;
  const query = {email : email};
  const user = await usersCollection.findOne(query);
  let isAdmin = false;
  if(user?.role === 'admin'){
    isAdmin= true;
  }
  res.json({admin : isAdmin});
})
// user send to db by POST api
app.post('/users' , async(req, res)=>{
  const user = req.body;
  const result = await usersCollection.insertOne(user);
  res.json(result);
})
// user update & insert(upsert)
app.put('/users', async(req, res)=>{
  const user = req.body;
  const filter = {email : user.email};
  const options = { upsert: true };
  const updateDoc = {$set :user};
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  res.json(result);
})
// make admin 
app.put('/users/admin' , async(req,res)=>{
  const user= req.body;
  console.log('put user', user);
  const filter = {email : user.email};
  const updateDoc = {$set : {role : 'admin'}};
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.json(result);
})


}
finally{
    // await client.close();
}

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From Diva Eyeshadow Palette!')
})

app.listen(port, () => {
  console.log('Running Diva Eyshadow Palette Server on port' , port);
})