const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.geakxzz.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb://0.0.0.0:27017";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const toyDatabase = client.db('toyMarketPlace').collection('toy');
    const blogData = client.db('toyMarketPlace').collection('blogPost');

    // const indexKeys={name:1}
    // const indexOption={name:"toyName"}

    // const result=await toyDatabase.createIndex(indexKeys,indexOption);
    app.get('/blog', async (req, res) => {
      const result = await blogData.find().toArray();
      res.json(result);
    });
    app.get('/alltoy', async (req, res) => {
      const result = await toyDatabase.find().limit(20).toArray();
      res.json(result);
    });

    // try
    // app.get('/terstToy/:email', async (req, res) => {
    //   console.log(req.query);
    //   const email = req.params.email;
    //   const result = await toyDatabase.aggregate([
    //     { "$match": { "sellerEmail": email } },
    //     { "$sort": { "price": 1 } },
    //     { "$limit": 10 }
    //   ]).toArray();

    //   res.send(result)
    // })

    app.get('/terstToy', async (req, res) => {
      console.log(req.query);
      const email = req.query.email;
      const sortDirection = req.query.sort || 'asc'; // Default to ascending order if no sort parameter is provided
      console.log(req.query);

      const sortOption = sortDirection === 'asc' ? 1 : -1;

      const result = await toyDatabase
        .aggregate([
          { $match: { sellerEmail: email } },
          { $sort: { price: sortOption } },
          { $limit: 10 },
        ])
        .toArray();

      res.json(result);
    });

    // try

    app.get('/mytoys/:email', async (req, res) => {
      // const type=req.query.type =="ascending"
      // const value=req.query.value;
      // console.log(value)
      // const sortObj={}
      // sortObj[value]=type ? 1 : -1;
      // console.log(req.params.email)
      const result = await toyDatabase
        .find({ sellerEmail: req.params.email })
        .sort({ price: 1 })
        .toArray();
      res.json(result);
    });
    app.post('/alltoy', async (req, res) => {
      const data = req.body;
      const result = await toyDatabase.insertOne(data);
      res.json(result);
    });
    app.get('/toycategory/:category', async (req, res) => {
      const result = await toyDatabase
        .find({ subCategory: req.params.category })
        .limit(3)
        .toArray();
      res.json(result);
    });
    // us
    app.put('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateToy = req.body;
      // console.log(updateToy)
      const options = { upsert: true };
      const updatedToy = {
        $set: {
          price: updateToy.price,
          quantity: updateToy.quantity,
          description: updateToy.description,
        },
      };
      const result = await toyDatabase.updateOne(filter, updatedToy, options);
      res.json(result);
      // console.log(id)
    });
    // us
    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyDatabase.findOne(query);
      res.json(result);
      // console.log(id)
    });
    app.delete('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyDatabase.deleteOne(query);
      res.json(result);
      // console.log(id)
    });
    app.get('/searchToyName/:toyName', async (req, res) => {
      const name = req.params.toyName;
      const result = await toyDatabase
        .find({ $or: [{ name: { $regex: name, $options: 'i' } }] })
        .toArray();
      res.send(result);
      console.log(name);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('assignment-11 running');
});
app.listen(port, () => {
  console.log('assignment 11 running on port', port);
});
