import express from 'express';
import { bulkuploadusers, getAllRoles, getUserPermissions, getallusers, passwordreset, updatepassword, updatestatus, updateUserPermissions, updateusers } from '../controllers/usermanagment/usermanagement';
const router = express.Router();



router.get('/getallusers', getallusers);
router.put('/updateusers/:id', updateusers);
router.put('/updatepassword/:id', updatepassword);
router.put('/updatestatus/:id', updatestatus);
router.post('/bulkuploadusers', bulkuploadusers);
router.post('/passwordreset/:id', passwordreset);
router.get("/roles", getAllRoles);
router.put("/:id/permissions", updateUserPermissions);
router.get("/:id/permissions", getUserPermissions);
export default router;
