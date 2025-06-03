import express from 'express';
import {
    addCoupon,
    getAllCoupons,
    deleteCoupon,
    getAllEnableCoupons,
    changeStatusOfCoupon,
    getCouponsForWebsite,
    getVerifyCoupon,
    getAllEnableCouponsForOnBoarding,
    getAllCouponsBookB,
    createCouponBookB,
    updateCouponBookB,
    deleteCouponBookB,
    getCouponBookB,
    getAllCouponsEnableBookB
} from '../../api/coupon.api.js';

const router = express.Router();
import middleware from '../../config/middleware.js';


router.get('/get-website-coupon-by-salon-name', getCouponsForWebsite)
router.get('/verify-coupon', getVerifyCoupon);
router.get('/get-coupons-for-on-boarding', getAllEnableCouponsForOnBoarding);
router.get('/get-active-coupon',getAllCouponsEnableBookB);

router.use(middleware.optional)
router.post('/add-coupon', addCoupon);
router.get('/get-coupons', getAllCoupons)
router.get('/get-coupon-enable-list', getAllEnableCoupons);
router.delete('/delete-coupon', deleteCoupon)
router.patch('/enable-disable-coupon', changeStatusOfCoupon)
router.route('/').get(getAllCouponsBookB).post(createCouponBookB);
router.route('/:id').get(getCouponBookB).patch(updateCouponBookB).delete(deleteCouponBookB);





export default router;
