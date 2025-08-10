import express from "express";
import { createDoctorWardNote, getAllDoctorWardNotes, getDoctorWardNoteById, updateDoctorWardAdmissionNote } from "../controllers/doctor-ward-round/doctor-ward-round.controller";

const router = express.Router();

router.route("")
    .get(getAllDoctorWardNotes)
    .post(createDoctorWardNote);

router.route("/:id")
    .get(getDoctorWardNoteById)
    .put(updateDoctorWardAdmissionNote);

export default router;