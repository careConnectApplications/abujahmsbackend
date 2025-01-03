import express from 'express';
import {createprices,getallprices,updateprices,updatepricestatus} from '../controllers/setting/pricesetting';
import {createclinics,getallclinic,updateclinics} from '../controllers/setting/clinics';
const router = express.Router();


router.post('/createprices',createprices);
router.get('/getallprices',getallprices);

router.post('/createclinics',createclinics);
router.get('/getallclinic',getallclinic);
router.put('/updateclinics/:id', updateclinics);
//updateclinics

router.put('/updateprices/:id',updateprices);
router.put('/updatepricestatus/:id', updatepricestatus);




export default router;
