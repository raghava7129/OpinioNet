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
        const post = await postCollection.find().toArray();
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
