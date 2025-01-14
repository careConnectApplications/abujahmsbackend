import express from 'express';
import {createprices,getallprices,updateprices,updatepricestatus} from '../controllers/setting/pricesetting';
import {createclinics,getallclinic,updateclinics} from '../controllers/setting/clinics';
import {createservicetypes,getallservicetypes,updateservicetypes} from '../controllers/setting/servicetype';
const router = express.Router();


router.post('/createprices',createprices);
router.get('/getallprices',getallprices);

router.post('/createclinics',createclinics);
router.get('/getallclinic',getallclinic);
router.put('/updateclinics/:id', updateclinics);

router.put('/updateprices/:id',updateprices);
router.put('/updatepricestatus/:id', updatepricestatus);


router.post('/createservicetypes',createservicetypes);
router.get('/getallservicetypes',getallservicetypes);
router.put('/updateservicetypes/:id', updateservicetypes);
//updateservicetypes




export default router;
