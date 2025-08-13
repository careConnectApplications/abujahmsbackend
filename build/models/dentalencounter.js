"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//import mongoose from "mongoose";
const mongoose_1 = __importStar(require("mongoose"));
const dentalEncounterSchema = new mongoose_1.Schema({
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
    createdBy: String,
    updatedBy: String,
    patientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Patientsmanagement',
        required: true
    },
    appointmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    admissionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Admission'
    },
}, {
    timestamps: true
});
const DentalRecord = (0, mongoose_1.model)("DentalEncounter", dentalEncounterSchema);
exports.default = DentalRecord;
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
