import express from 'express';
import {
    CreateHistopatholgyService,
    getAllHistopathologyPaginatedHandler, 
    getHistopathologyRecordById
} from '../controllers/histopathology/histopathology.controller';

const router = express.Router();

router.post("", CreateHistopatholgyService);
router.get("", getAllHistopathologyPaginatedHandler);
router.get("/:id", getHistopathologyRecordById);
router.post("/test", )
////test/:id to post to post all exam/result
/// put /:id to update record details
export default router;