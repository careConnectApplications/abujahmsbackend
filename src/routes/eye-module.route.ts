import express from "express";
import {
    createExamination,
<<<<<<< HEAD
    createEyeConsultation,
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    createLensPrescription,
    createOperationalNotes,
    createPreliminaryTest,
    getAllEyeRecordsPaginatedHandler,
    getAllEyeUtilData,
    getEyeRecordByAppointmentIdAndPatientId,
    getEyeRecordById,
    getEyeRecordByPatientId,
    updateExamination,
<<<<<<< HEAD
    updateEyeConsultation,
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    updateLensPrescription,
    updateOperationalTest,
    updatePreliminaryTest
} from "../controllers/eye-module/eye-module.controller";

const router = express.Router();

router.post("/lens-prescription", createLensPrescription);
router.post("/preliminary-test", createPreliminaryTest);
router.post("/create-examination", createExamination);
router.post("/operational-notes/appointment/:appointmentId/patient/:patientId", createOperationalNotes);
router.get("/appointment/:appointmentId/patient/:patientId", getEyeRecordByAppointmentIdAndPatientId);
router.get("/patient/:patientId", getEyeRecordByPatientId)
router.get("/:Id", getEyeRecordById);
router.get("", getAllEyeRecordsPaginatedHandler);
router.get("/data/config", getAllEyeUtilData);
router.patch("/lens-prescription/:eyeModuleId", updateLensPrescription);
router.patch("/preliminary-test/:eyeModuleId", updatePreliminaryTest);
router.patch("/examination/:eyeModuleId", updateExamination);
router.patch("/operational-notes/:eyeModuleId", updateOperationalTest);
<<<<<<< HEAD
router.post("/eye-consultation", createEyeConsultation);
router.put("/eye-consultation/:eyeModuleId", updateEyeConsultation);
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

export default router;