import express from 'express';
import {
    createpatients, getallpatients,
    updatepatients, uploadpix,
    getonepatients, bulkuploadhmopatients,
    getallhmopatients, searchpartient,
    updateauthorizationcode, updatePatientToHmo,
    updatePatientClinicalInformation,
    updatePatientFluidBalancing
} from '../controllers/patientmanagement/patientmanagement';
const router = express.Router();


router.post('/uploadpatientphoto/:id', uploadpix);
router.post('/createpatients', createpatients);
router.put('/updateauthorizationcode/:id', updateauthorizationcode);
router.get('/getallpatients', getallpatients);
router.put('/updatepatients/:id', updatepatients);
router.get('/getonepatients/:id', getonepatients);
router.post('/bulkuploadhmopatients', bulkuploadhmopatients);
router.get('/getallhmopatients', getallhmopatients);
router.get('/searchpartient/:searchparams', searchpartient);
router.put("/update-to-hmo/:id", updatePatientToHmo);
router.put("/update-clinical-information/:id", updatePatientClinicalInformation);
router.put("/update-fluid-balancing/:patientId", updatePatientFluidBalancing);

export default router;
