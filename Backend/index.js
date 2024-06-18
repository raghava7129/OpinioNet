const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const base64 = require('base-64');
const axios = require('axios');

const {connectToDatabase } = require('./Config/db');
const subscriptionRoutes = require('./Routes/SubscriptionRoutes/SubscriptionRoutes');

const {sendOTP, verifyOTP} = require('./Controllers/emailController/emailController');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

let db;

connectToDatabase().then((collections) => {

  db = collections;

    // get endpoints

    app.get('/', (req, res) => {
      res.send('OpinioNet');
    });

    app.get('/post', async (req, res) => {  
      try {
        const posts = await db.postCollection.find().toArray();
        res.send(posts.reverse());
      } catch (error) {
        console.error("Error getting posts:", error);
        res.status(500).send("Error getting posts");
      }
    });

    app.get('/register', async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).send("Email parameter is required");
        }

        const user = await db.userCollection.findOne({ email });
        res.send(user ? [user] : []);
      } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).send("Error getting user");
      }
    });

    app.get('/registeredUsers', async (req, res) => {
      try {
        const users = await db.userCollection.find().toArray();
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

        const user = await db.userCollection.findOne({ email });
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

        const posts = await db.postCollection.find({ email }).toArray();
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

        const posts = await db.postCollection.find({ username }).toArray();
        res.status(200).send(posts);
      } catch (error) {
        console.error("Error getting user's posts:", error);
        res.status(500).send("Internal server error");
      }
    });

    subscriptionRoutes(app, db);

    app.get('/checkInVoiceStatus', async (req, res)=>{
      try{
        const invoiceId = req.query.inVoiceId;

        // console.log("from backEnd /checkInVoiceStatus ==> ",invoiceId);

        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        const auth = base64.encode(`${key_id}:${key_secret}`);

        const response = await axios.get(`https://api.razorpay.com/v1/invoices/${invoiceId}`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        });
        res.json(response.data);

      }catch(error){
        if (error.response) {
          console.error('Error response:', error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error('Error checking invoice status :', error.message);
        }
      }
    });


    // post endpoints

    app.post('/post', async (req, res) => {
      try {
        const post = req.body;
        const result = await db.postCollection.insertOne(post);
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

        const prevUser = await db.userCollection.findOne({ email });
        if (prevUser) {
          res.status(409).send("Username already taken");
        } else {
          const result = await db.userCollection.insertOne(req.body);
          res.status(201).send("User created");
        }
      } catch (error) {
        console.log("Error inserting user:", error);
        res.status(500).send("Error inserting user");
      }
    });

    const currentTime = new Date();
    const expireTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
    const expireByTimestamp = Math.floor(expireTime.getTime() / 1000);


    app.post('/create_invoice', async (req, res) => {
      const { plan, NAME, EMAIL } = req.body;
      const key_id = process.env.RAZORPAY_KEY_ID;
      const key_secret = process.env.RAZORPAY_KEY_SECRET;
      const auth = base64.encode(`${key_id}:${key_secret}`);

      const data = {
        type: "invoice",
        description: plan.description,
        partial_payment: false,
        customer: {
          name: NAME,
          email: EMAIL
        },
        line_items: [
          {
            name: plan.name,
            description: plan.description,
            amount: plan.price*100,  
            currency: "INR",
            quantity: 1
          }
        ],
        sms_notify: 0,
        email_notify: 1,
        currency: "INR",
        expire_by: expireByTimestamp
      };
    
      try {
        const response = await axios.post('https://api.razorpay.com/v1/invoices', data, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        });
        res.json(response.data);
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error('Error creating invoice:', error.message);
          res.status(500).send('Error creating invoice');
        }
      }
    });


    app.post('/LoginTrack', async (req, res) => {
      const { email, deviceInfo } = req.body;

      try {
        let deviceInfoDoc = await db.LoginTrackCollection.findOne({ email });

        if (!deviceInfoDoc) {

            await db.LoginTrackCollection.insertOne({
              email: email,
              sessions: [{
                  deviceInfo: deviceInfo,
                  loginTime: new Date()
              }]
            });
            res.status(201).json({ message: 'Device information saved successfully' });

        }
        else{

          await db.LoginTrackCollection.updateOne(
            { email: email },
            {
                $push: {
                    sessions: {
                        deviceInfo: deviceInfo,
                        loginTime: new Date()
                    }
                }
            }
        );
        res.status(200).json({ message: 'Device information updated successfully' });

        }

        
      } catch (error) {
        console.error('Error saving device information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });


    app.post('/send-otp', sendOTP);

    app.post('/verify-otp', verifyOTP);



     // patch endpoints

    app.patch('/userUpdates/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const profile = req.body;
        const options = { upsert: true };
        const updateDoc = {
        $set: profile,
        };

        const result = await db.userCollection.updateOne({ email }, updateDoc, options);
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
  
          const result = await db.postCollection.updateMany({ email }, updateDoc); 
          
          if (result.matchedCount === 0) {
              return res.status(404).send("No posts found with the specified email.");
          }
  
          res.status(200).send(result);
      } catch (error) {
          console.error("Error updating posts:", error);
          res.status(500).send("Error updating posts");
      }
   });
  

    app.listen(port, () => {
      console.log(`OpinioNet listening at http://localhost:${port}`); 
    });

}).catch(error => {
  console.error('Failed to connect to the database', error);
  process.exit(1);
});
