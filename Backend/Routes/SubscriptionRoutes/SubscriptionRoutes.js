// const cors = require('cors');

module.exports = (app, db) =>{

    // app.use(cors());
    const subscriptionController = require('../../Controllers/SubscriptionControllers/SubscriptionControllers')(db);

    app.get('/subscriptions/monthly', subscriptionController.getMonthlyPlan);
    app.get('/subscriptions/yearly', subscriptionController.getYearlyPlan);

    app.get('/subscriptions/user', subscriptionController.getAllSubscriptionDetails);
    app.get('/subscriptions/user/:email', subscriptionController.getSubscriptionDetailsByEmail);
    app.post('/subscriptions/user', subscriptionController.addUserSubscriptionDetails); 
    app.patch('/subscriptions/user/:email', subscriptionController.updateSubscriptionDetailsByEmail);



};