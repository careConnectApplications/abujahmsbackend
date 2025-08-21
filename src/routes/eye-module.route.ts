import express from "express";
import {
    createExamination,
    createEyeConsultation,
    createLensPrescription,
    createOperationalNotes,
    createPreliminaryTest,
    getAllEyeRecordsPaginatedHandler,
    getAllEyeUtilData,
    getEyeRecordByAppointmentIdAndPatientId,
    getEyeRecordById,
    getEyeRecordByPatientId,
    updateExamination,
    updateEyeConsultation,
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
router.post("/eye-consultation", createEyeConsultation);
router.put("/eye-consultation/:eyeModuleId", updateEyeConsultation);

export default router;