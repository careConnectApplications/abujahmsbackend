import { NextFunction, Request, Response } from "express";
import { validateinputfaulsyvalue } from "../../utils/otherservices";
import mongoose from 'mongoose';
import {
  readAllDentalEncounters,
  createDentalEncounter,
  readOneDentalEncounter,
  updateDentalEncounterById
} from "../../dao/dentalencounter";
import { readonepatient } from "../../dao/patientmanagement";
import { readoneappointment } from "../../dao/appointment";
import {readoneadmission} from  "../../dao/admissions";
import configuration from "../../config";
import catchAsync from "../../utils/catchAsync";const { ObjectId } = mongoose.Types;

// 🔍 Read all dental encounters by patient
export const readAllDentalByPatient = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { patient } = req.params;
  const { page = 1, limit = 150 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { patientId: patient };
  const select = {};
  const populate = "patientId";
  const secondpopulate = "appointmentId";

  const queryresult = await readAllDentalEncounters(query, select, populate, secondpopulate, skip, parseInt(limit));
  res.status(200).json({ queryresult, status: true });
});


export const createDentalEncounterController = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { id } = req.params; // patient ID
  const { firstName, lastName } = req.user.user;
  const staffname = `${firstName} ${lastName}`;

  const {
  chiefComplaint,
  dentalHistoryNotes,
  previousDentalProcedure,
  allergies,
  lastDentalVisit,
  currentMedications,
  additionalComplaints,
  otherDentalHistory,
  firstQuadrantNote,
  secondQuadrantNote,
  thirdQuadrantNote,
  fourthQuadrantNote,
  medicalConditions,
  gingivalAssessment,
  alerts,
  periodontalProbing,
  xrayRadiographicFindings,
    cariesDetection,
    occlusalAnalysis,
    oralCancerScreening,
    tmjAssessment,
    teethPresent,
    missingTeeth,
    mobileTeeth,
    cariousTeeth,
    retainedRoots,
    fracturedTeeth,
    impactedTeeth,
    tenderToPercussion,
    filledTeeth,
    periodontalPockets,
    cervicalAbrasions,
    crownBridgeRestoration,
    dentures,
    calculus,
    otherFindings,
    notes,
    intraOral,
    tongue,
    mucosa,
    otherIntraOral,
    overallImpression,
    provisionalDiagnosis,
    diagnosisList,
    diagnosisNotes,
    proposedTreatments,
    priorityAndUrgency,
    procedureDate,
    descriptionOfProcedure,
    toothNumbersTreated,
    anesthesiaDetails,
    materialsUsed,
    procedureNotes,
    postProcedureCareInstructions,
    appointmentoradmissionunderscoreid
  } = req.body;

  validateinputfaulsyvalue({ id, appointmentoradmissionunderscoreid });

  const patient: any = await readonepatient({ _id: id }, {}, '', '');
  if (!patient) {
    return next(new Error(`Patient does not exist ${configuration.error.erroralreadyexit}`));
  }

  const checkappointmentId = new ObjectId(appointmentoradmissionunderscoreid);
  const appointment: any = await readoneappointment({ _id: checkappointmentId }, {}, '');
  var appointmentId;
  var admissionId;
   var checkadimmison = await readoneadmission({ _id: checkappointmentId }, {}, '');
      if (checkadimmison) {
        admissionId =checkappointmentId;
  
      }
  if (appointment) {
    admissionId=checkappointmentId;
  }

  const input = {
    patientId: patient._id,
    appointmentId,
    admissionId,
    chiefComplaint,
  dentalHistoryNotes,
  previousDentalProcedure,
  allergies,
  lastDentalVisit,
  currentMedications,
  additionalComplaints,
  otherDentalHistory,
  quadrant: {
    firstQuadrantNote,
    secondQuadrantNote,
    thirdQuadrantNote,
    fourthQuadrantNote
  },
   medicalHistory: {
    medicalConditions,
    alerts
  },
  examinations: {
    gingivalAssessment,
    periodontalProbing,
    xrayRadiographicFindings,
    cariesDetection,
    occlusalAnalysis,
    oralCancerScreening,
    tmjAssessment,
    teethPresent,
    missingTeeth,
    mobileTeeth,
    cariousTeeth,
    retainedRoots,
    fracturedTeeth,
    impactedTeeth,
    tenderToPercussion,
    filledTeeth,
    periodontalPockets,
    cervicalAbrasions,
    crownBridgeRestoration,
    dentures,
    calculus,
    otherFindings
  },
  generalOralExam: {
      notes,
    intraOral,
    tongue,
    mucosa,
    otherIntraOral
  },
  impression: {
    overallImpression,
    provisionalDiagnosis
  },
  diagnosis: {
    diagnosisList,
    diagnosisNotes
  },
  treatmentPlan: {
    proposedTreatments,
    priorityAndUrgency
  },
   procedurePerformed: {
    procedureDate,
    descriptionOfProcedure,
    toothNumbersTreated,
    anesthesiaDetails,
    materialsUsed,
    procedureNotes,
    postProcedureCareInstructions,
    patientId:patient._id
  },
    createdBy: staffname
  };

  const queryresult = await createDentalEncounter(input);
  res.status(200).json({ queryresult, status: true });
});


// 🔄 Update dental encounter by ID
export const updateDentalEncounterController = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { firstName, lastName } = req.user.user;
  const staffname = `${firstName} ${lastName}`;

  const {
  chiefComplaint,
  dentalHistoryNotes,
  previousDentalProcedure,
  allergies,
  lastDentalVisit,
  currentMedications,
  additionalComplaints,
  otherDentalHistory,
  firstQuadrantNote,
  secondQuadrantNote,
  thirdQuadrantNote,
  fourthQuadrantNote,
  medicalConditions,
  gingivalAssessment,
  alerts,
  periodontalProbing,
  xrayRadiographicFindings,
    cariesDetection,
    occlusalAnalysis,
    oralCancerScreening,
    tmjAssessment,
    teethPresent,
    missingTeeth,
    mobileTeeth,
    cariousTeeth,
    retainedRoots,
    fracturedTeeth,
    impactedTeeth,
    tenderToPercussion,
    filledTeeth,
    periodontalPockets,
    cervicalAbrasions,
    crownBridgeRestoration,
    dentures,
    calculus,
    otherFindings,
    notes,
    intraOral,
    tongue,
    mucosa,
    otherIntraOral,
    overallImpression,
    provisionalDiagnosis,
    diagnosisList,
    diagnosisNotes,
    proposedTreatments,
    priorityAndUrgency,
    procedureDate,
    descriptionOfProcedure,
    toothNumbersTreated,
    anesthesiaDetails,
    materialsUsed,
    procedureNotes,
    postProcedureCareInstructions
  } = req.body;
  const updates = {
  chiefComplaint,
  dentalHistoryNotes,
  previousDentalProcedure,
  allergies,
  lastDentalVisit,
  currentMedications,
  additionalComplaints,
  otherDentalHistory,
  quadrant: {
    firstQuadrantNote,
    secondQuadrantNote,
    thirdQuadrantNote,
    fourthQuadrantNote
  },
   medicalHistory: {
    medicalConditions,
    alerts
  },
  examinations: {
    gingivalAssessment,
    periodontalProbing,
    xrayRadiographicFindings,
    cariesDetection,
    occlusalAnalysis,
    oralCancerScreening,
    tmjAssessment,
    teethPresent,
    missingTeeth,
    mobileTeeth,
    cariousTeeth,
    retainedRoots,
    fracturedTeeth,
    impactedTeeth,
    tenderToPercussion,
    filledTeeth,
    periodontalPockets,
    cervicalAbrasions,
    crownBridgeRestoration,
    dentures,
    calculus,
    otherFindings
  },
  generalOralExam: {
      notes,
    intraOral,
    tongue,
    mucosa,
    otherIntraOral
  },
  impression: {
    overallImpression,
    provisionalDiagnosis
  },
  diagnosis: {
    diagnosisList,
    diagnosisNotes
  },
  treatmentPlan: {
    proposedTreatments,
    priorityAndUrgency
  },
   procedurePerformed: {
    procedureDate,
    descriptionOfProcedure,
    toothNumbersTreated,
    anesthesiaDetails,
    materialsUsed,
    procedureNotes,
    postProcedureCareInstructions
  },
    updatedBy: staffname
  };

 

  const queryresult = await updateDentalEncounterById(id, updates);
  res.status(200).json({ queryresult, status: true });
});

// 🔍 Read one dental encounter
export const readOneDentalEncounterController = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const queryresult = await readOneDentalEncounter({ _id: id }, {});
  res.status(200).json({ queryresult, status: true });
});
