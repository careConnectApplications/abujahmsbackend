import express from 'express';
import {createprices,getallprices,updateprices,updatepricestatus} from '../controllers/setting/pricesetting';
import {createclinics,getallclinic,updateclinics,getonlyclinic} from '../controllers/setting/clinics';
import {createservicetypes,getallservicetypes,updateservicetypes,getpharmacyservicetype} from '../controllers/setting/servicetype';
import {createward,getallward,updateward} from '../controllers/setting/wardmanagement';
import {createtheatre,getalltheatre,updatetheatre} from '../controllers/setting/theatremanagement';
import {createhmo,getallhmo,updatehmo} from "../controllers/setting/hmomanagement";
const router = express.Router();


router.post('/createprices',createprices);
router.get('/getallprices',getallprices);

router.post('/createclinics',createclinics);
router.get('/getallclinic',getallclinic);
router.get('/getonlyclinic',getonlyclinic);
//getonlyclinic
router.put('/updateclinics/:id', updateclinics);

router.put('/updateprices/:id',updateprices);
router.put('/updatepricestatus/:id', updatepricestatus);


router.post('/createservicetypes',createservicetypes);
router.get('/getallservicetypes',getallservicetypes);
router.put('/updateservicetypes/:id', updateservicetypes);

//getpharmacyservicetype
router.get('/getpharmacyservicetype',getpharmacyservicetype);
//ward management
router.post('/createward',createward);
router.get('/getallward',getallward);
router.put('/updateward/:id',updateward);
//theatre
router.post('/createtheatre',createtheatre);
router.get('/getalltheatre',getalltheatre);
router.put('/updatetheatre/:id',updatetheatre);
//hmo
router.post('/createinsurance',createhmo);
router.get('/getallinsurance',getallhmo);
router.put('/updateinsurance/:id',updatehmo);



    



export default router;
