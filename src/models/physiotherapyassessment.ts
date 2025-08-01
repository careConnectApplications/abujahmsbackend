import mongoose, { Schema } from "mongoose";

const physiotherapyAssessmentSchema = new Schema({
  

  // 1. Subjective Assessment
  clinicalassessment:{
  chiefComplaint: [String],
  historyOfPresentCondition: [String],
  medicalHistory: [String],
  surgicalHistory: [String],
  medications: [String],
  previousTreatments: [String],
  },

  // 2. Physical Examination and Objective Findings
  physicalexamination:{
  bloodPressure: String,
  pulse: String,
  respiratoryRate: String,
  temperature: String,
  muscleStrengthTesting: [String],
  posturalAssessment: [String],
  gaitAnalysis: [String],
  palpationFindings: [String],
  specialTests: [String],
  },

  // 3. Functional Assessment and Outcome Measures
  functionalLimitations: [String],
  outcomeMeasures: {
    visualAnalogScaleForPain: String,
    oswestryDisabilityIndex: String,
    timeUpAndGoTest: String,
    sixMinutesWalkTest: String,
    outcomeMeasureNotes: [String],
  },

  // 4. Diagnosis and Clinical Impression
  diagnosisandclinicalImpression:{
  diagnosisICDEleven: [String],
  primaryDiagnosisNotes: [String],
  secondaryDiagnosisNotes: [String],
  clinicalImpressions: [String],
  },

  // 5. Treatment Plan and Goals
  treatmentplanandgoals:{
  shortTermGoals: [String],
  longTermGoals: [String],
  intervention: [String],
  },
  rangeofmotion:{
  affectedBodyPart: { type: String },
  slideOfBody: { type: String },
  jointName: { type: String},
  
  movementType: {
    type: String,
    enum: [
      "Flexion",
      "Extension",
      "Abduction",
      "Adduction",
      "Internal",
      "External",
      "Circumduction",
      "Elevation",
      "Depression"
    ]
  },

  activeRangeOfMotion: { type: String },
  passiveRangeOfMotion: { type: String },
  normalRangeOfMotion: { type: String },
  ROMDeficit: { type: String },

  painLevelDuringMovement: {
    type: Number,
    enum: ["1", "2", "3", "4", "5", "6"]
  },

  endFeel: { type: String },
  assessmentToolUsed: { type: String },
  functionalImpact: { type: String },
  progressNotes: { type: String },
  notes: [{ type: String }]
  },
  createdBy:String,
  updatedBy:String,
  patientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patientsmanagement',
        required: true
      },
      appointmentId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    }
},{
  timestamps: true
});

const PhysiotherapyAssessment = mongoose.model(
  "PhysiotherapyAssessment",
  physiotherapyAssessmentSchema
);

export default PhysiotherapyAssessment;

