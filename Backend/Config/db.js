const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@opinionet.aee51z4.mongodb.net/?retryWrites=true&w=majority&appName=OpinioNet`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase(){
    try {
        await client.connect();
        const db = client.db('OpinioNet');

        return {
          postCollection: db.collection('posts'),
          userCollection: db.collection('users'),
          subscriptionCollection: db.collection('subscriptionCollection'),
          userSubscriptionDetailsCollection: db.collection('userSubscriptionDetails'),
          LoginTrackCollection: db.collection('LoginTrack')
        };
    } catch (error) {
    console.error('Failed to connect to the database', error);
    throw error;
    }
}

module.exports = {
    connectToDatabase,
    client
};