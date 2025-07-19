import express from 'express';
import { CreateHistopatholgyService, getHistopathologyRecordById, getAllHistopathology } from '../controllers/histopathology/histopathology.controller';

const router = express.Router();

router.post("", CreateHistopatholgyService);
router.get("", getAllHistopathology);
router.get("/:id", getHistopathologyRecordById);
////test/:id to post to post all exam/result
/// put /:id to update record details
export default router;