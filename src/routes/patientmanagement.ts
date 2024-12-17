import express from 'express';
import {createpatients,getallpatients,updatepatients,uploadpix} from '../controllers/patientmanagement/patientmanagement';
const router = express.Router();


router.post('/uploadpatientphoto/:id',uploadpix);
router.post('/createpatients',createpatients);
router.get('/getallpatients',getallpatients);
router.put('/updatepatients/:id',updatepatients);




export default router;
