
module.exports = (db) => {
    const getMonthlyPlan = async (req, res) => {
      try {
        const monthlyPlan = await db.subscriptionCollection.find({ planType: 'Monthly' }).toArray();
        res.send(monthlyPlan);
      } catch (error) {
        console.error("Error getting monthly plan:", error);
        res.status(500).send("Error getting monthly plan");
      }
    };
  
    const getYearlyPlan = async (req, res) => {
      try {
        const yearlyPlan = await db.subscriptionCollection.find({ planType: 'Yearly' }).toArray();
        res.send(yearlyPlan);
      } catch (error) {
        console.error("Error getting yearly plan:", error); 
        res.status(500).send("Error getting yearly plan");
      }
    };

    const getSubscriptionDetailsByEmail = async (req, res) => {
      try{
        const email =  req.params.email;
        if(!email){
          return res.status(400).send("Email parameter is required");
        }

        const subscription = await db.userSubscriptionDetailsCollection.findOne({ email });
        res.send(subscription ? [subscription] : []);

      }
      catch(error){
        console.error("Error getting subscription details by email:", error);
      }
    };

    const addUserSubscriptionDetails = async (req, res) => {
      try{
        const { email, postLimit} = req.body;

        if(!email || postLimit === undefined || postLimit === null){
          return res.status(400).send("Email and post limit are required");
        }
        const subscription = await db.userSubscriptionDetailsCollection.findOne({email});
        if(subscription){
          return res.status(400).send("Subscription details already exists for this email");
        }
        else{
          const newSubscription = {
            email,
            postLimit
          };
          await db.userSubscriptionDetailsCollection.insertOne(newSubscription);
          res.send(newSubscription);
        }
      }
      catch(error){
        console.error("Error adding user subscription details:", error);

      }
    };

    const updateSubscriptionDetailsByEmail = async (req, res) => {
      try{
        const email = req.params.email;
        const { postLimit } = req.body;

        if(!email || postLimit === undefined || postLimit === null){
          return res.status(400).send("Email and post limit are required");
        }

        const subscription = await db.userSubscriptionDetailsCollection.findOne({ email });
        if(!subscription){
          return res.status(404).send("Subscription details not found");
        }

        await db.userSubscriptionDetailsCollection.updateOne({ email }, { $set: { postLimit } });
        res.send({ email, postLimit });
      }
      catch(error){
        console.error("Error updating subscription details by email:", error);
      }
    }

    const getAllSubscriptionDetails = async (req, res) => {
      try{
        const subscriptionDetails = await db.userSubscriptionDetailsCollection.find({}).toArray();
        res.send(subscriptionDetails);
      }
      catch(error){
        console.error("Error getting all subscription details:", error);
      }
    }

    return {
      getMonthlyPlan,
      getYearlyPlan,
      getSubscriptionDetailsByEmail,
      getAllSubscriptionDetails,
      addUserSubscriptionDetails,
      updateSubscriptionDetailsByEmail
    };
  };
  