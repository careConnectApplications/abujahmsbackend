//import mongoose from "mongoose";
import mongoose, { Schema, model } from "mongoose";

const dentalEncounterSchema = new Schema({
  // Chief Complaint & Dental History
  chiefComplaint: [String],
  dentalHistoryNotes: [String],
  previousDentalProcedure: [String],
  allergies: [String],
  lastDentalVisit: Date,
  currentMedications: String,
  additionalComplaints: [String],
  otherDentalHistory: String,

  // Quadrant Notes
  quadrant: {
    firstQuadrantNote: [String],
    secondQuadrantNote: [String],
    thirdQuadrantNote: [String],
    fourthQuadrantNote: [String],
  },

  // Medical History and Alerts
  medicalHistory: {
    medicalConditions: String,
    alerts: String,
  },

  // Examinations and Findings
  examinations: {
    gingivalAssessment: {
      type: String,
      enum: ['Healthy', 'Inflamed', 'Receding', 'Bleeding', 'Periodontal Pockets'],
    },
    periodontalProbing: String,
    xrayRadiographicFindings: String,
    cariesDetection: String,
    occlusalAnalysis: String,
    oralCancerScreening: {
      type: String,
      enum: ['Normal', 'Abnormal', 'Biopsy Recommended'],
    },
    tmjAssessment: {
      type: String,
      enum: ['Normal', 'Clicking', 'Painful', 'Limited Movement', 'Other'],
    },
    teethPresent: String,
    missingTeeth: String,
    mobileTeeth: String,
    cariousTeeth: String,
    retainedRoots: String,
    fracturedTeeth: String,
    impactedTeeth: String,
    tenderToPercussion: String,
    filledTeeth: String,
    periodontalPockets: String,
    cervicalAbrasions: String,
    crownBridgeRestoration: String,
    dentures: String,
    calculus: String,
    otherFindings: [String],
  },

  // General Oral Examination
  generalOralExam: {
    
    notes: [String],
    intraOral: {
      type: String,
      enum: ['Swollen Gum', 'Recession', 'Tenderness', 'Hyperemic Gum', 'Periodontal Pockets'],
    },
    tongue: String,
    mucosa: String,
    otherIntraOral: [String],
  },

  // Impression
  impression: {
    overallImpression: [String],
    provisionalDiagnosis: [String],
  },

  // Diagnosis
  diagnosis: {
    diagnosisList: [String],
    diagnosisNotes: [String],
  },

  // Treatment Plan
  treatmentPlan: {
    proposedTreatments: [String],
    priorityAndUrgency: {
      type: String,
      enum: ['Urgent', 'Routine', 'Elective'], // Can be adjusted
    },
  },

  // Procedure Performed
  procedurePerformed: {
    procedureDate: Date,
    descriptionOfProcedure: [String],
    toothNumbersTreated: String,
    anesthesiaDetails: String,
    materialsUsed: String,
    procedureNotes: String,
    postProcedureCareInstructions: String,
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
    ref: 'Appointment'
  },
  admissionId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission'
  },
}, {
  timestamps: true
});

const DentalRecord = model("DentalEncounter", dentalEncounterSchema);
export default DentalRecord;


/*
const dentalEncounterSchema = new mongoose.Schema({
  // Investigation Section
  investigations: {
    type: [String], // Multiline textbox
    default: []
  },

  // Treatment Section
  treatments: {
    type: [String], // Multiline textbox
    default: []
  },

  // Dental Chart Section
  dentalChart: {
    presentingComplaints: {
      type: [String], // Checkbox options
      enum: [
        "Dental Check",
        "Broken tooth",
        "Mouth Odour",
        "Tooth ache",
        "Sensitive Tooth",
        "Sores in mouth",
        "Facial Swelling",
        "Discoloration",
        "Shaking Teeth",
        "Bleeding Gum",
        "Swollen Gum",
        "Missing Teeth"
      ],
      default: []
    },
    historyOfPresentingComplaints: {
      type: [String], // Multiline textbox
      default: []
    },
    duration: {
      type: String // Textbox
    },
    onset: {
      type: String,
      enum: ["suddenly", "gradually", "unknown"]
    },
    painSeverity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe"]
    },
    radiationOfPain: {
      type: String,
      enum: ["Yes", "No"] // You can modify this based on your exact radio button labels
    }
  },

  // Examination Section
  examination: {
    generalExamination: {
      type: [String], // Multiline
      default: []
    },
    extraOral: {
      type: [String], // Multiline
      default: []
    },
    intraOral: {
      softTissue: {
        gum: {
          type: String,
          enum: ["swollen gums", "hypenenumgum"]
        },
        others: {
          type: [String], // Multiline
          default: []
        },
        tongue: {
          type: [String], // Multiline
          default: []
        }
      }
    }
  },

  // Diagnosis Section
  diagnosis: {
    diagnosisICD10: {
      type: [String], // Dropdown (multi-select)
      default: []
    },
    diagnosisNonICD10: {
      type: [String], // Multiline
      default: []
    }
  },

  // Treatment Plan Section
  treatmentPlan: {
    type: [String], // Multiline
    default: []
  },

  // Impression Section
  impression: {
    impressionICD10: {
      type: [String], // Dropdown (multi-select)
      default: []
    },
    impressionNonICD10: {
      type: [String], // Multiline
      default: []
    }
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("DentalEncounter", dentalEncounterSchema);
*/
