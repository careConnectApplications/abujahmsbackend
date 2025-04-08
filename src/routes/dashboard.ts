//dashboard
import express from 'express';
import {protect} from "../utils/middleware";
import {newdashboard} from '../controllers/dashboard/dashboard';
const router = express.Router();



router.get('/',newdashboard);



export default router;
