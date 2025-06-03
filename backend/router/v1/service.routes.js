import express from 'express';
import { changeRank, changeStatusOfService, createService, deleteService, getAllEnableMainServices, getAllEnableSubServices, getAllServices, getAllServicesGroupByCategory, getAllSubServices, getAllwebsiteServicesGroupByCategory, getAllwebsiteServicesGroupByCategorySalon } from '../../api/service.api.js';

const router = express.Router();
import middleware from '../../config/middleware.js';


router.get('/get-website-service-groupby-category', getAllwebsiteServicesGroupByCategory) 
router.get('/get-website-service-groupby-category-salon', getAllwebsiteServicesGroupByCategorySalon) 

router.use(middleware.optional)

router.post('/add-service', createService)
router.get('/get-main-service', getAllServices)
router.get('/get-sub-service', getAllSubServices)
router.get('/get-enable-main-service', getAllEnableMainServices)
router.patch('/enable-disable-service', changeStatusOfService)
router.delete('/delete-service', deleteService)
router.get('/get-enable-sub-service', getAllEnableSubServices)
router.get('/get-service-groupby-category', getAllServicesGroupByCategory)
router.patch('/rank-update-service', changeRank)

export default router;
