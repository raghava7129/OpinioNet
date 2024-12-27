const express = require('express');
const router = express.Router();

module.exports = (db) =>{
    const subscriptionController = require('../../Controllers/SubscriptionControllers/SubscriptionControllers')(db);

    router.route("/userSubscriptionDetails")
        .get(subscriptionController.getAllSubscriptionDetails)
        .post(subscriptionController.addUserSubscriptionDetails);

    router
        .get("/monthly", subscriptionController.getMonthlyPlan)
        .get("/yearly", subscriptionController.getYearlyPlan);

    
    router.route("/userSubscriptionDetails/:email")
        .get(subscriptionController.getSubscriptionDetailsByEmail)
        .patch(subscriptionController.updateSubscriptionDetailsByEmail);
    
    return router;
};