const { connectToDatabase } = require('./db');
// require('dotenv').config();

async function sampleSubscriptionData() {
  const { subscriptionCollection } = await connectToDatabase();

  const subscriptions = [
    {
      planType: "Monthly",
      name: "Basic Monthly",
      price: 9.99,
      postLimit: 10,
      description: "Basic monthly subscription with limited posting features.",
      features: [
        "10 posts per month"
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      planType: "Monthly",
      name: "Premium Monthly",
      price: 20,
      postLimit: 60,
      description: "Premium monthly subscription with increased posting limits.",
      features: [
        "60 posts per month"
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      planType: "Yearly",
      name: "Basic Yearly",
      price: 99.99,
      postLimit: 120,
      description: "Basic yearly subscription with limited posting features.",
      features: [
        "120 posts per year"
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    {
      planType: "Yearly",
      name: "Premium Yearly",
      price: 199.99,
      postLimit: 600,
      description: "Premium yearly subscription with increased posting limits.",
      features: [
        "600 posts per year"
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  try {
    for(const subscription of subscriptions){
      const existingSubscription = await subscriptionCollection.findOne({ name: subscription.name });

      if(!existingSubscription){
        await subscriptionCollection.insertOne(subscription);
      }
      else{
        console.log(`Subscription plan "${subscription.name}" already exists. Skipping...`);
      }
    }
    console.log("Sample data inserted.");
  }
  catch(error){
    console.error("Error inserting sample data:", error);
  }

}

sampleSubscriptionData();
