import express from 'express';
import {createpatients,getallpatients,updatepatients} from '../controllers/patientmanagement/patientmanagement';
const router = express.Router();



router.post('/createpatients',createpatients);
router.get('/getallpatients',getallpatients);
router.put('/updatepatients/:id',updatepatients);



export default router;
