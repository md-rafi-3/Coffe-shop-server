const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app=express()
const port =process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());


// db

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cmpq8iw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.cmpq8iw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const coffeesCollection=client.db("coffeeDB").collection("coffees");
    const userCollection=client.db("coffeeDB").collection('users')

    app.get("/coffees",async(req,res)=>{
      const cursor=coffeesCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })


    app.get("/coffees/:id",async(req,res)=>{
      const id=req.params.id;
      const quary={_id: new ObjectId(id)};
      const result=await coffeesCollection.findOne(quary);
      res.send(result)

    })

    app.put("/coffees/:id",async(req,res)=>{
      const id=req.params.id;
      const filter={_id: new ObjectId(id)};
      const options={upsert:true};
      const updatedCoffee=req.body;
      const updateddoc={
        $set:updatedCoffee
      }
      const result=await coffeesCollection.updateOne(filter,updateddoc,options);
      res.send(result);
    })

    app.post("/coffees",async(req,res)=>{
      const newCoffee=req.body;
      console.log(newCoffee);
      const result=await coffeesCollection.insertOne(newCoffee);
      res.send(result);
    })

    app.delete("/coffees/:id",async(req,res)=>{
      const id =req.params.id;
      const quary={_id: new ObjectId(id)}
      const result=await coffeesCollection.deleteOne(quary);
      res.send(result)
    })



        // user related apis
        // add user
        app.post("/users",async(req,res)=>{
          const userProfile=req.body;
          console.log(userProfile);
          const result=await userCollection.insertOne(userProfile);
          res.send(result);
        })

        // find user
        app.get("/users",async(req,res)=>{
          const result=await userCollection.find().toArray();
          res.send(result)
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
    res.send("coffe shop server is running")
})

app.listen(port,()=>{
    console.log("sarver is running port:",port)
})

// user:Coffe-Shop-DB
// pass:fgg6p2VR5vSsL9LP