const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwhgbgz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const usersCollection = client.db("classesDB").collection("users");
    const classesCollection = client.db("classesDB").collection("classes");


    
   
   
    // user related apis
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });


    app.get('/users/admin/:email', async(req,res)=>{
      const email = req.params.email;
      const query = {email:email};
      const user = await usersCollection.findOne(query);
      const result = {admin: user?.role === 'admin'};
      res.send(result);
    })
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(filter);
      res.send(result);
    });

    // class related apis
    // add class
    app.post("/addAClass", async (req, res) => {
      const body = req.body;
      const result = await classesCollection.insertOne(body);
      res.send(result);
      console.log(result);
    });

    // get class
    app.get("/getClass", async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    });
    // delete any class
    app.delete("/addAClass/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await classesCollection.deleteOne(filter);
      res.send(result);
    });

    // update any class
    app.put("/updateClass/:id", async (req, res) => {
      const id = req.params.id;
      const updatedClass = req.body;
      const filter = { _id: new ObjectId(id) };

      const option ={
        upsert: true,
      }
      console.log(updatedClass);

      const updateDoc = {
        $set: {
          day: updatedClass.day,
          firstClass: updatedClass.firstClass,
          firstTeacher: updatedClass.firstTeacher,
          secondClass: updatedClass.secondClass,
          secondTeacher: updatedClass.secondTeacher,
          thirdClass: updatedClass.thirdClass,
          thirdTeacher: updatedClass.thirdTeacher,
          fourthClass: updatedClass.fourthClass,
          fourthTeacher: updatedClass.fourthTeacher,
          fifthClass: updatedClass.fifthClass,
          fifthTeacher: updatedClass.fifthTeacher,
          sixthClass: updatedClass.sixthClass,
          sixthTeacher: updatedClass.sixthTeacher,
        },
      };
      const result = await classesCollection.updateOne(filter, updateDoc,option);
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Dynamic class routine is running");
});

app.listen(port, () => {
  console.log(`Dynamic class routine management is running on port ${port}`);
});
