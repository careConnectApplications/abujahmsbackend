import express from 'express';
import {createpatients,getallpatients,updatepatients,uploadpix,getonepatients} from '../controllers/patientmanagement/patientmanagement';
const router = express.Router();


router.post('/uploadpatientphoto/:id',uploadpix);
router.post('/createpatients',createpatients);
router.get('/getallpatients',getallpatients);
router.put('/updatepatients/:id',updatepatients);
router.get('/getonepatients/:id', getonepatients);




export default router;
