import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import catchAsync from "../../utils/catchAsync";
import configuration from "../../config";
import { validateinputfaulsyvalue } from "../../utils/otherservices";
import { readonepatient } from "../../dao/patientmanagement";
import { readoneappointment } from "../../dao/appointment";
import {
  createPhysiotherapyAssessment,
  readAllPhysiotherapyAssessments,
  readOnePhysiotherapyAssessment,
  updatePhysiotherapyAssessmentById
} from "../../dao/physiotherapyassessment";
import {readoneadmission} from  "../../dao/admissions";

const { ObjectId } = mongoose.Types;

export const createPhysiotherapyAssessments = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { id } = req.params; // patient ID
  const { firstName, lastName } = req.user.user;
  const staffname = `${firstName} ${lastName}`;
  const { 
  appointmentoradmissionunderscoreid,
  chiefComplaint,
  historyOfPresentCondition,
  medicalHistory,
  surgicalHistory,
  medications,
  previousTreatments,
   bloodPressure,
  pulse,
  respiratoryRate,
  temperature,
  muscleStrengthTesting,
  posturalAssessment,
  gaitAnalysis,
  palpationFindings,
  specialTests,
  functionalLimitations,
   visualAnalogScaleForPain,
    oswestryDisabilityIndex,
    timeUpAndGoTest,
    sixMinutesWalkTest,
    outcomeMeasureNotes,
    diagnosisICDEleven,
  primaryDiagnosisNotes,
  secondaryDiagnosisNotes,
  clinicalImpressions,
  shortTermGoals,
  longTermGoals,
  intervention,
  affectedBodyPart,
  slideOfBody,
  jointName,
  movementType,
  activeRangeOfMotion,
  passiveRangeOfMotion,
  normalRangeOfMotion,
  ROMDeficit,
  painLevelDuringMovement,
  endFeel,
  assessmentToolUsed,
  functionalImpact,
  progressNotes,
  notes
  
   } = req.body;

  validateinputfaulsyvalue({ id, appointmentoradmissionunderscoreid });
//const appointmentId = new ObjectId(appointmentunderscoreid);
  const patient = await readonepatient({ _id: id }, {}, '', '');
  if (!patient) return next(new Error(`Patient does not exist ${configuration.error.erroralreadyexit}`));
  var checkappointmentId=new ObjectId(appointmentoradmissionunderscoreid);
  const appointment = await readoneappointment({ _id: checkappointmentId }, {}, '');
  var checkadimmison = await readoneadmission({ _id: checkappointmentId }, {}, '');
  var appointmentId;
  var admissionId;
  if (checkadimmison) {
          admissionId =checkappointmentId;
    
        }
          if (appointment) {
    appointmentId=checkappointmentId;
  }
  //if (!appointment) return next(new Error(`Appointment does not exist ${configuration.error.erroralreadyexit}`));
  

   
  const input = {
  patientId: patient._id,
  appointmentId,
  admissionId,
  createdBy: staffname,

rangeofmotion:{
  affectedBodyPart,
  slideOfBody,
  jointName,
  movementType,
  activeRangeOfMotion,
  passiveRangeOfMotion,
  normalRangeOfMotion,
  ROMDeficit,
  painLevelDuringMovement,
  endFeel,
  assessmentToolUsed,
  functionalImpact,
  progressNotes,
  notes
  },


  clinicalassessment:{
  chiefComplaint,
  historyOfPresentCondition,
  medicalHistory,
  surgicalHistory,
  medications,
  previousTreatments
  },
  physicalexamination:{
  bloodPressure,
  pulse,
  respiratoryRate,
  temperature,
  muscleStrengthTesting,
  posturalAssessment,
  gaitAnalysis,
  palpationFindings,
  specialTests
  },
  functionalLimitations,
  outcomeMeasures: {
    visualAnalogScaleForPain,
    oswestryDisabilityIndex,
    timeUpAndGoTest,
    sixMinutesWalkTest,
    outcomeMeasureNotes
  },
  diagnosisandclinicalImpression:{
  diagnosisICDEleven,
  primaryDiagnosisNotes,
  secondaryDiagnosisNotes,
  clinicalImpressions
  },
  treatmentplanandgoals:{
  shortTermGoals,
  longTermGoals,
  intervention,
  }
  
  };

  const queryresult = await createPhysiotherapyAssessment(input);
  res.status(201).json({ queryresult, status: true });
});

export const readAllPhysiotherapyAssessmentByPatient = catchAsync(async (req: Request, res: Response) => {
  const { patient } = req.params;
  const { page = 1, limit = 150 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const queryresult = await readAllPhysiotherapyAssessments({ patientId: patient }, {}, "patientId", "appointmentId", skip, parseInt(limit as string));
  res.status(200).json({ queryresult, status: true });
});

export const readOnePhysiotherapyAssessments = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const queryresult = await readOnePhysiotherapyAssessment({ _id: id }, {});
  res.status(200).json({ queryresult, status: true });
});

export const updatePhysiotherapyAssessment = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { firstName, lastName } = req.user.user;
  const staffname = `${firstName} ${lastName}`;
  const{
    chiefComplaint,
  historyOfPresentCondition,
  medicalHistory,
  surgicalHistory,
  medications,
  previousTreatments,
   bloodPressure,
  pulse,
  respiratoryRate,
  temperature,
  muscleStrengthTesting,
  posturalAssessment,
  gaitAnalysis,
  palpationFindings,
  specialTests,
  functionalLimitations,
   visualAnalogScaleForPain,
    oswestryDisabilityIndex,
    timeUpAndGoTest,
    sixMinutesWalkTest,
    outcomeMeasureNotes,
    diagnosisICDEleven,
  primaryDiagnosisNotes,
  secondaryDiagnosisNotes,
  clinicalImpressions,
  shortTermGoals,
  longTermGoals,
  intervention,
  affectedBodyPart,
  slideOfBody,
  jointName,
  movementType,
  activeRangeOfMotion,
  passiveRangeOfMotion,
  normalRangeOfMotion,
  ROMDeficit,
  painLevelDuringMovement,
  endFeel,
  assessmentToolUsed,
  functionalImpact,
  progressNotes,
  notes
  } = req.body;

  const updates = {
rangeofmotion:{
  affectedBodyPart,
  slideOfBody,
  jointName,
  movementType,
  activeRangeOfMotion,
  passiveRangeOfMotion,
  normalRangeOfMotion,
  ROMDeficit,
  painLevelDuringMovement,
  endFeel,
  assessmentToolUsed,
  functionalImpact,
  progressNotes,
  notes
  },
  clinicalassessment:{
  chiefComplaint,
  historyOfPresentCondition,
  medicalHistory,
  surgicalHistory,
  medications,
  previousTreatments
  },
  physicalexamination:{
  bloodPressure,
  pulse,
  respiratoryRate,
  temperature,
  muscleStrengthTesting,
  posturalAssessment,
  gaitAnalysis,
  palpationFindings,
  specialTests
  },
  functionalLimitations,
  outcomeMeasures: {
    visualAnalogScaleForPain,
    oswestryDisabilityIndex,
    timeUpAndGoTest,
    sixMinutesWalkTest,
    outcomeMeasureNotes
  },
  diagnosisandclinicalImpression:{
  diagnosisICDEleven,
  primaryDiagnosisNotes,
  secondaryDiagnosisNotes,
  clinicalImpressions
  },
  treatmentplanandgoals:{
  shortTermGoals,
  longTermGoals,
  intervention,
  },
    updatedBy: staffname
  };

  const queryresult = await updatePhysiotherapyAssessmentById(id, updates);
  res.status(200).json({ queryresult, status: true });
});
