import {
  readAllPsychiatricEvaluations,
  createPsychiatricEvaluation,
  readOnePsychiatricEvaluation,
  updatePsychiatricEvaluationById
} from "../../dao/psychiatric";

import { readonepatient } from "../../dao/patientmanagement";
import configuration from "../../config";

// 🔍 Read all evaluations by patient
export const readAllPsychiatricByPatient = async (req: any, res: any) => {
  try {
    const { patient } = req.params;
    const query = { patientId: patient };
    const select = {};
    const populate = "patientId";
    const secondpopulate = "appointmentId";

    const queryresult = await readAllPsychiatricEvaluations(query, select, populate, secondpopulate);

    res.status(200).json({ queryresult, status: true });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};

// ➕ Create new psychiatric evaluation
export const createPsychiatricEvaluationController = async (req: any, res: any) => {
  try {
    const { id } = req.params; // patient ID
    const { firstName, lastName } = (req.user).user;
    const staffname = `${firstName} ${lastName}`;

    const {
      presentingcomplains,
      historyofpresentingcomplaints,
      pastpsychiatrichistory,
      pastmedicalandsurgicalhistory,
      familyhistory,
      personaldevelopmenthistory,
      educationhistory,
      occupationhistory,
      psychosocialhistory,
      substanceusehistory,
      forensichistory,
      premorbidhistory,
      assessmentdiagnosis,
      planmanagement,
      appointmentId
    } = req.body;

    const patient = await readonepatient({ _id: id }, {}, '', '');
    if (!patient) {
      throw new Error(`Patient does not exist ${configuration.error.erroralreadyexit}`);
    }

    const input = {
      patientId: patient._id,
      appointmentId,
      presentingcomplains,
      historyofpresentingcomplaints,
      pastpsychiatrichistory,
      pastmedicalandsurgicalhistory,
      familyhistory,
      personaldevelopmenthistory,
      educationhistory,
      occupationhistory,
      psychosocialhistory,
      substanceusehistory,
      forensichistory,
      premorbidhistory,
      assessmentdiagnosis,
      planmanagement,
      createdBy: staffname
    };

    const queryresult = await createPsychiatricEvaluation(input);
    res.status(200).json({ queryresult, status: true });

  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });
  }
};

// 🔄 Update psychiatric evaluation by ID
export const updatePsychiatricEvaluationController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = (req.user).user;
    const staffname = `${firstName} ${lastName}`;

    const {
      presentingcomplains,
      historyofpresentingcomplaints,
      pastpsychiatrichistory,
      pastmedicalandsurgicalhistory,
      familyhistory,
      personaldevelopmenthistory,
      educationhistory,
      occupationhistory,
      psychosocialhistory,
      substanceusehistory,
      forensichistory,
      premorbidhistory,
      assessmentdiagnosis,
      planmanagement
    } = req.body;

    const updates = {
      presentingcomplains,
      historyofpresentingcomplaints,
      pastpsychiatrichistory,
      pastmedicalandsurgicalhistory,
      familyhistory,
      personaldevelopmenthistory,
      educationhistory,
      occupationhistory,
      psychosocialhistory,
      substanceusehistory,
      forensichistory,
      premorbidhistory,
      assessmentdiagnosis,
      planmanagement,
      updatedBy: staffname
    };

    const queryresult = await updatePsychiatricEvaluationById(id, updates);
    res.status(200).json({ queryresult, status: true });

  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });
  }
};

// Optional: Read one by ID
export const readOnePsychiatricEvaluationController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const queryresult = await readOnePsychiatricEvaluation({ _id: id }, {});
    res.status(200).json({ queryresult, status: true });
  } catch (e: any) {
    res.status(403).json({ status: false, msg: e.message });
  }
};
