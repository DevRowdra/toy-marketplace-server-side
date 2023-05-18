const express = require('express');
const cors = require('cors');
const app=express()
require('dotenv').config()
const port=process.env.PORT || 3000;

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.geakxzz.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb://0.0.0.0:27017";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyDatabase = client.db("toyMarketPlace").collection("toy")

    

app.get("/alltoy",async(req,res)=>{
    const result=await toyDatabase.find().toArray()
    res.send(result)
})
app.get("/mytoys/:email",async(req,res)=>{
    
    // console.log(req.params.email)
    const result=await toyDatabase.find({sellerEmail:req.params.email}).toArray()
    res.send(result)
   
    
})
app.post('/alltoy',async(req,res)=>{
    const data=req.body
    const result= await toyDatabase.insertOne(data)
    res.send(result)
})
app.get('/toy/:id',async(req,res)=>{
    const id=req.params.id
    const query={_id:new ObjectId(id)}
    const result=await toyDatabase.findOne(query)
    res.send(result)
    // console.log(id)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('assignment-11 running')
})
app.listen(port,()=>{
    console.log('assignment 11 running on port',port)
})