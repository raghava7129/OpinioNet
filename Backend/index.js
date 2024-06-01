const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;  // Corrected PORT environment variable

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

    app.get('/post', async (req, res) => {  
      try {
        const posts = await postCollection.find().toArray();
        res.send(posts.reverse());
      } catch (error) {
        console.error("Error getting posts:", error);
        res.status(500).send("Error getting posts");
      }
    });

    app.post('/post', async (req, res) => {
      try {
        const post = req.body;
        const result = await postCollection.insertOne(post);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting post:", error);
        res.status(500).send("Error inserting post");
      }
    });

    app.post('/register', async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).send("Email is required");
        }

        const prevUser = await userCollection.findOne({ email });
        if (prevUser) {
          res.status(409).send("Username already taken");
        } else {
          const result = await userCollection.insertOne(req.body);
          res.status(201).send("User created");
        }
      } catch (error) {
        console.log("Error inserting user:", error);
        res.status(500).send("Error inserting user");
      }
    });

    app.get('/register', async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).send("Email parameter is required");
        }

        const user = await userCollection.findOne({ email });
        res.send(user ? [user] : []);
      } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).send("Error getting user");
      }
    });

    app.get('/registeredUsers', async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        res.send(users);
      } catch (error) {
        console.error("Error getting registered users:", error);
        res.status(500).send("Error getting registered users");
      }
    });

    app.get('/loggedInUser', async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).send("Email parameter is required");
        }

        const user = await userCollection.findOne({ email });
        res.send(user ? [user] : []);
      } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).send("Error getting user");
      }
    });

    app.get('/posts', async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).send("Email parameter is required");
        }

        const posts = await postCollection.find({ email }).toArray();
        res.status(200).send(posts);
      } catch (error) {
        console.error("Error getting user's posts:", error);
        res.status(500).send("Internal server error");
      }
    });

    app.get('/getPosts', async (req, res) => {
      try {
        const username = req.query.username;
        if (!username) {
          return res.status(400).send("username parameter is required");
        }

        const posts = await postCollection.find({ username }).toArray();
        res.status(200).send(posts);
      } catch (error) {
        console.error("Error getting user's posts:", error);
        res.status(500).send("Internal server error");
      }
    });


    app.patch('/userUpdates/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const profile = req.body;
        const options = { upsert: true };
        const updateDoc = {
        $set: profile,
        };

        const result = await userCollection.updateOne({ email }, updateDoc, options);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
      }
    });


    app.patch('/postUpdates/:email', async (req, res) => {
      try {
          const email = req.params.email;
          const { profilePic } = req.body;
  
          const updateDoc = {
              $set: { profilePic }, 
          };
  
          const result = await postCollection.updateMany({ email }, updateDoc); 
          
          if (result.matchedCount === 0) {
              return res.status(404).send("No posts found with the specified email.");
          }
  
          res.status(200).send(result);
      } catch (error) {
          console.error("Error updating posts:", error);
          res.status(500).send("Error updating posts");
      }
  });
  

    app.get('/', (req, res) => {
      res.send('OpinioNet');
    });

    app.listen(port, () => {
      console.log(`OpinioNet listening at http://localhost:${port}`); 
    });

  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);
