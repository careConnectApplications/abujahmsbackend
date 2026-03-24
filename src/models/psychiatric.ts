const mongoose = require('mongoose');
const psychiatricEvaluationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patientsmanagement',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  admissionId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admission'
    },
  presentingcomplaints: [String],
  historyofpresentingcomplaints: [String],
  pastpsychiatrichistory: [String],
  pastmedicalandsurgicalhistory: [String],
  familyhistory: [String],
  personaldevelopmenthistory: [String],
  educationhistory: [String],
  occupationhistory: [String],
  psychosocialhistory: [String],
  substanceusehistory: [String],
  forensichistory: [String],
  premorbidhistory: [String],
  assessmentdiagnosis: [String],
  planmanagement: [String],
  updatedBy:String,
  createdBy: String
 
},
{ timestamps: true }
);

<<<<<<< HEAD
// Add indexes for performance optimization
// Single field indexes
psychiatricEvaluationSchema.index({ patientId: 1 });
psychiatricEvaluationSchema.index({ appointmentId: 1 });
psychiatricEvaluationSchema.index({ admissionId: 1 });
psychiatricEvaluationSchema.index({ createdAt: -1 });

// Compound indexes for common query patterns
psychiatricEvaluationSchema.index({ patientId: 1, createdAt: -1 });
psychiatricEvaluationSchema.index({ appointmentId: 1, patientId: 1 });

=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
const psychiatric = mongoose.model('PsychiatricEvaluation', psychiatricEvaluationSchema);
export default psychiatric;
