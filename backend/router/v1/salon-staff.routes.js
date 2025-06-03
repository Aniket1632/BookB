import express from 'express';
import { changeStatusOfUser, createSalonStaff, deleteSalonStaff, getAllSalonStaff } from '../../api/salon-staff.api.js';

const router = express.Router();
import middleware from '../../config/middleware.js';

router.use(middleware.optional)

router.post('/create-salon-staff', createSalonStaff)
router.get('/get-salon-staff', getAllSalonStaff)
router.delete('/delete-salon-staff', deleteSalonStaff)
router.patch('/enable-disable-salon-staff', changeStatusOfUser)


export default router;
