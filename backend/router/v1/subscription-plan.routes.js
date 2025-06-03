import express from 'express';
import {
    addSubscriptionPlan,
    getAllSubscriptionPlans,
    deleteSubscriptionPlan,
    getAllEnableSubscriptionPlans,
    changeStatusOfSubscriptionPlan,
    getSubscriptionPlansForWebsite,
    updatePlan,
    createPlan,
    deletePlan,
    getAllActivePlans,
    cancelSubscription,
    getSubscriptionDetails, 
    getPricing,totalPrice
} from '../../api/subscription-plan.api.js';

const router = express.Router();
import middleware from '../../config/middleware.js';

// router.get('/get-website-subscription-plan', getSubscriptionPlansForWebsite)
//router.route('/get-packages').get(getAllActivePlans);  // odl one with all schemes
router.route('/get-packages').get(getPricing); // new one with tiered pricing
//router.route('/get-pricing').get(getPricing)
router.route('/total-price/:qty/:code?').get(totalPrice)

router.use(middleware.optional)

router.post('/add-subscription-plan', addSubscriptionPlan);
router.get('/get-subscription-plans', getAllSubscriptionPlans)
router.get('/get-subscription-plan-enable-list', getAllEnableSubscriptionPlans);
router.delete('/delete-subscription-plan', deleteSubscriptionPlan)
router.patch('/enable-disable-subscription-plan', changeStatusOfSubscriptionPlan)
router.get('/cancel-subscription',cancelSubscription)
router.get('/get-subscription-detail',getSubscriptionDetails)

router.route('/plans/').post(createPlan);
router.route('/plans/:id').patch(updatePlan).delete(deletePlan); 



export default router;
