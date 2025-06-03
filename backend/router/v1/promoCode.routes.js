import express from 'express';
import {
    createPromoCode,
    getPromoCode,
    getAllPromoCodes,
    updatePromoCode,
    getPromoCodeByCode,
    getAllActivePromoCodes
} from '../../api/coupon.api.js';

const router = express.Router();
import middleware from '../../config/middleware.js';

router.route('/promo-codes/:code').get(getPromoCodeByCode);
router.route('/get-promo-codes').get(getAllActivePromoCodes);




router.use(middleware.optional) 
router.route('/').get(getAllPromoCodes).post(createPromoCode);
router.route('/:id').get(getPromoCode).patch(updatePromoCode);

export default router;
