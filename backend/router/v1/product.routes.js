import express from 'express';
import { uploadImage } from '../../config/multer.config.js';
import middleware from '../../config/middleware.js';
import { changeStatusOfCategory, createCategory, deleteCategory, getAllCategory, getAllEnableCategory, getAllEnableWebsiteCategory } from '../../api/product-category.api.js';
import { getProductBySalonForWebsite, addUpdateProduct, deleteProduct, getProductByCategory, getProductById, changeStatusOfProduct, getSimilarProduct, getProductBySalon, getProductBySalonForMobile, getWebsiteSimilarProduct, getProductBySalonForWebsiteUsingId } from '../../api/product.api.js';
import { addOrder, changeOrderStatus, getOrderByUser, getOrderBySaloon, getOrderDetails, addPayment } from '../../api/product-order.api.js';
import { addStock, getStockByProduct } from '../../api/product-stock.api.js';

const router = express.Router();


router.post('/get-product-by-salon-for-website', getProductBySalonForWebsite)
router.post('/get-product-by-salon-for-website-using-id', getProductBySalonForWebsiteUsingId)
router.get('/get-website-product-by-id', getProductById)
router.get('/get-enabled-website-category', getAllEnableWebsiteCategory)
router.get('/get-similar-website-product', getWebsiteSimilarProduct)
router.get('/get-order-by-id', getOrderDetails) 
router.post('/payment', addPayment)

router.use(middleware.optional)

router.post('/create-category', createCategory)
router.get('/get-category', getAllCategory)
router.delete('/delete-category', deleteCategory)
router.patch('/enable-disable-category', changeStatusOfCategory)
router.get('/get-enabled-category', getAllEnableCategory)

router.post('/add-product', uploadImage.single('image'), addUpdateProduct)
router.get('/get-product-by-category', getProductByCategory)
router.delete('/delete-product', deleteProduct)
router.patch('/enable-disable-product', changeStatusOfProduct)
router.get('/get-product-by-id', getProductById)
router.get('/get-product-by-salon', getProductBySalon)
router.get('/get-product-by-salon-for-mobile', getProductBySalonForMobile)
router.get('/get-similar-product', getSimilarProduct)

router.post('/add-order', addOrder)
router.get('/get-order-by-user', getOrderByUser)
router.get('/get-order-by-salon', getOrderBySaloon)
router.patch('/change-order-status', changeOrderStatus)

router.post('/add-stock', addStock)
router.get('/get-stock-by-product', getStockByProduct)

export default router;
