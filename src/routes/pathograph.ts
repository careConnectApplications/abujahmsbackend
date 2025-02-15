import express from 'express';
import {protect} from "../utils/middleware";
import {readAllpathographByPatient, updatepathographs, createpathographs,markascomplete} from '../controllers/pathograph/pathograph';
const router = express.Router();


router.post('/createpathographs/:id', createpathographs);
router.put('/updatepathographs/:id', updatepathographs);
router.get('/readallpathographbypatient/:patient', readAllpathographByPatient);
router.put('/markascompletepathographs/:id', markascomplete);



export default router;

