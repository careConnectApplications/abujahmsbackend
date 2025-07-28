import mongoose from "mongoose";

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
