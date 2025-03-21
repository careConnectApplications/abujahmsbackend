import express from 'express';
import {createpatients,getallpatients,updatepatients,uploadpix,getonepatients,bulkuploadhmopatients} from '../controllers/patientmanagement/patientmanagement';
const router = express.Router();


router.post('/uploadpatientphoto/:id',uploadpix);
router.post('/createpatients',createpatients);
router.get('/getallpatients',getallpatients);
router.put('/updatepatients/:id',updatepatients);
router.get('/getonepatients/:id', getonepatients);
router.post('/bulkuploadhmopatients', bulkuploadhmopatients);



export default router;
