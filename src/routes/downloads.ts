import express from 'express';
import {downloadtemplates} from '../controllers/downloads/downloads';
const router = express.Router();



router.get('/downloadtemplate/:type',downloadtemplates);


//updateusers


export default router;
