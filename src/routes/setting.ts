import express from 'express';
import {createprices,getallprices,updateprices,updatepricestatus} from '../controllers/setting/pricesetting';
const router = express.Router();



router.post('/createprices',createprices);
router.get('/getallprices',getallprices);
router.put('/updateprices/:id',updateprices);
router.put('/updatepricestatus/:id', updatepricestatus);




export default router;
