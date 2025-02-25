//dashboard
import express from 'express';
import {protect} from "../utils/middleware";
import {dashboard} from '../controllers/dashboard/dashboard';
const router = express.Router();



router.get('/',dashboard);


export default router;
