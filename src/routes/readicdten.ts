import express from 'express';
import {readicdten} from '../controllers/icdten/icdten';

//import {readicdten} from "../controllers/icdten/icdten";
const router = express.Router();


router.post('/readicdten',readicdten);

//readicdten
//router.get('/readicdten',readicdten);

    



export default router;
