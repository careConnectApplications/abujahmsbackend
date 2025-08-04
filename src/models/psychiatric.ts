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

const psychiatric = mongoose.model('PsychiatricEvaluation', psychiatricEvaluationSchema);
export default psychiatric;
