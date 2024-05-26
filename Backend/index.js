const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(cors());

require('dotenv').config();
app.use(bodyParser.json());

const port = process.env.port || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@opinionet.aee51z4.mongodb.net/?retryWrites=true&w=majority&appName=OpinioNet`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const postCollection = client.db('OpinioNet').collection('posts');
    const userCollection = client.db('OpinioNet').collection('users');

    app.get('/post', async (req, res)=>{  
      try{
        const post = (await postCollection.find().toArray()).reverse();
        res.send(post);
        
      } catch(error){
        console.error("Error getting posts:", error);
        res.status(500).send("Error getting posts");
      }
    });

    app.post('/post', async (req, res) => {
        try {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.status(201);
        } catch (error) {
            console.error("Error inserting post:", error);
            res.status(500).send("Error inserting post");
        }
    });

    app.post('/register', async (req, res) => {
        try {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.status(201);
        } catch (error) {
            console.error("Error inserting user:", error);
            res.status(500).send("Error inserting user");
        }
    });
    
    app.get('/register', async (req, res)=>{
      try{
        const email = req.query.email;
        const user = await userCollection.find({email: email}).toArray();
        res.send(user);
        
      } catch(error){
        console.error("Error getting user:", error);
        res.status(500).send("Error getting user");
      }
    });

    app.get('/registeredUsers', async (req, res)=>{
      try{
        const user = await userCollection.find().toArray();
        res.send(user);
        
      } catch(error){
        console.error("Error getting Registered users : ", error);
        res.status(500).send("Error getting Registered users");
      }
    });


   app.get('/loggedInUser', async (req, res)=>{
      try{
        const email = req.query.email;
        const user = await userCollection.find({email : email}).toArray();
        res.send(user);
        
      } catch(error){
        console.error("Error getting users:", error);
        res.status(500).send("Error getting users");
      }
    });

    app.get('/posts', async (req, res) => {
      try {
          const email = req.query.email;
          if (!email) {
              return res.status(400).send("Email parameter is required");
          }
  
          const posts = await postCollection.find({ email: email }).toArray();
          res.status(200).send(posts);
      } catch (error) {
          console.error("Error getting user's posts:", error);
          res.status(500).send("Internal server error");
      }
  });

  } catch(error) {
    console.log(error);
  }

  


}
run().catch(console.dir);


app.get('/', (req, res) => {
        res.send('OpinioNet');
    }).listen(port, () => {
        console.log(`OpinioNet listening at http://localhost:${port}`); 
});
