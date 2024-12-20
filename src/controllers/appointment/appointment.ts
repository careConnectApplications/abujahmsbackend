const Examination = require('../models/examination');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');


// Create a new examination record
/*
const createExamination = async (req, res) => {
  const { patient_id, doctor_id, findings, diagnosis, prescriptions, notes } = req.body;

  try {
    const patient = await Patient.findById(patient_id);
    const doctor = await Doctor.findById(doctor_id);

    if (!patient || !doctor) {
      return res.status(400).json({ message: 'Invalid patient or doctor ID' });
    }

    const examination = new Examination({
      patient_id,
      doctor_id,
      findings,
      diagnosis,
      prescriptions,
      notes
    });

    await examination.save();
    res.status(201).json(examination);
  } catch (error) {
    res.status(500).json({ message: 'Error creating examination', error });
  }
};

// Get all examination records
const getExaminations = async (req, res) => {
  try {
    const examinations = await Examination.find()
      .populate('patient_id')
      .populate('doctor_id');
    res.status(200).json(examinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching examinations', error });
  }
};

// Get examination by patient
const getExaminationsByPatient = async (req, res) => {
  const { patient_id } = req.params;

  try {
    const examinations = await Examination.find({ patient_id })
      .populate('doctor_id');
    if (!examinations) {
      return res.status(404).json({ message: 'No examinations found for this patient' });
    }
    res.status(200).json(examinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching examinations', error });
  }
};

// Get examination by doctor
const getExaminationsByDoctor = async (req, res) => {
  const { doctor_id } = req.params;

  try {
    const examinations = await Examination.find({ doctor_id })
      .populate('patient_id');
    if (!examinations) {
      return res.status(404).json({ message: 'No examinations found for this doctor' });
    }
    res.status(200).json(examinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching examinations', error });
  }
};

module.exports = {
  createExamination,
  getExaminations,
  getExaminationsByPatient,
  getExaminationsByDoctor
};
*/