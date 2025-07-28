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

// ➕ Create new dental encounter
export const createDentalEncounterController = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { id } = req.params; // patient ID
  const { firstName, lastName } = req.user.user;
  const staffname = `${firstName} ${lastName}`;

  const {
    appointmentunderscoreid,
    investigations,
    treatments,
    presentingComplaints,
    historyOfPresentingComplaints,
    duration,
    onset,
    painSeverity,
    radiationOfPain,
    generalExamination,
    extraOral,
    intraOral,
    diagnosisICD10,
    diagnosisNonICD10,
    treatmentPlan,
    impressionICD10,
    impressionNonICD10,
    gum,
    tongue,
    others
  } = req.body;

  validateinputfaulsyvalue({ id, appointmentunderscoreid });

  const patient: any = await readonepatient({ _id: id }, {}, '', '');
  if (!patient) {
    return next(new Error(`Patient does not exist ${configuration.error.erroralreadyexit}`));
  }

  const appointmentId = new ObjectId(appointmentunderscoreid);
  const appointment: any = await readoneappointment({ _id: appointmentId }, {}, '');
  if (!appointment) {
    return next(new Error(`Appointment does not exist ${configuration.error.erroralreadyexit}`));
  }

  const input = {
    patientId: patient._id,
    appointmentId,
    investigations,
    treatments,
    dentalChart: {
      presentingComplaints,
      historyOfPresentingComplaints,
      duration,
      onset,
      painSeverity,
      radiationOfPain
    },
    examination: {
      generalExamination,
      extraOral,
      intraOral: {
        softTissue: {
          gum,
          tongue,
          others
        }
      }
    },
    diagnosis: {
      diagnosisICD10,
      diagnosisNonICD10
    },
    treatmentPlan,
    impression: {
      impressionICD10,
      impressionNonICD10
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
    investigations,
    treatments,
    presentingComplaints,
    historyOfPresentingComplaints,
    duration,
    onset,
    painSeverity,
    radiationOfPain,
    generalExamination,
    extraOral,
    intraOral,
    diagnosisICD10,
    diagnosisNonICD10,
    treatmentPlan,
    impressionICD10,
    impressionNonICD10,
    gum,
    tongue,
    others
  } = req.body;

  const updates = {
    investigations,
    treatments,
    dentalChart: {
      presentingComplaints,
      historyOfPresentingComplaints,
      duration,
      onset,
      painSeverity,
      radiationOfPain
    },
    examination: {
      generalExamination,
      extraOral,
      intraOral: {
        softTissue: {
          gum,
          tongue,
          others
        }
      }
    },
    diagnosis: {
      diagnosisICD10,
      diagnosisNonICD10
    },
    treatmentPlan,
    impression: {
      impressionICD10,
      impressionNonICD10
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
