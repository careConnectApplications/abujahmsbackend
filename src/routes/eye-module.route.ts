import express from "express";
import {
    createExamination,
    createLensPrescription,
    createOperationalNotes,
    createPreliminaryTest,
    getAllEyeRecordsPaginatedHandler,
    getAllEyeUtilData,
    getEyeRecordByAppointmentIdAndPatientId,
    getEyeRecordById
} from "../controllers/eye-module/eye-module.controller";

const router = express.Router();

router.post("/lens-prescription", createLensPrescription);
router.post("/preliminary-test", createPreliminaryTest);
router.post("/create-examination", createExamination);
router.post("/operational-notes/appointment/:appointmentId/patient/:patientId", createOperationalNotes);
router.get("/appointment/:appointmentId/patient/:patientId", getEyeRecordByAppointmentIdAndPatientId)
router.get("/:Id", getEyeRecordById);
router.get("", getAllEyeRecordsPaginatedHandler);
router.get("/data/config", getAllEyeUtilData)

export default router;