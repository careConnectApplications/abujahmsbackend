import mongoose, { Schema, Document } from "mongoose";

export interface IInsuranceClaim extends Document {
  patient: mongoose.Types.ObjectId;
  serviceCategory: string;
  lab?: mongoose.Types.ObjectId;
  radiology?: mongoose.Types.ObjectId;
  procedure?: mongoose.Types.ObjectId;
  pharmacy?: mongoose.Types.ObjectId;
  histopathology?: mongoose.Types.ObjectId;
  authorizationCode?: string;
  approvalCode?: string;
  status: "Submitted" | "Re-submitted" | "Cancelled" | "Rejected" | "Paid";
  amountClaimed: number;
  amountApproved?: number;
  actualcost?: number;
  action?: "approve" | "reject";
  insurer?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InsuranceClaimSchema: Schema<IInsuranceClaim> = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patientsmanagement", required: true },
    serviceCategory: { type: String, required: true },
    lab: { type: Schema.Types.ObjectId, ref: "Lab" },
    radiology: { type: Schema.Types.ObjectId, ref: "Radiology" },
    procedure: { type: Schema.Types.ObjectId, ref: "Procedure" },
    pharmacy: { type: Schema.Types.ObjectId, ref: "Prescription" },
    histopathology: { type: Schema.Types.ObjectId, ref: "Histopathology" },
    authorizationCode: { type: String },
    approvalCode: { type: String },
    action: String,
    status: {
      type: String,
      enum: ["Submitted", "Re-submitted", "Cancelled", "Rejected", "Paid"],
      default: "Submitted",
    },
    amountClaimed: { type: Number, required: true },
    amountApproved: { type: Number },
    actualcost:{ type: Number },
    insurer: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

// Add indexes for performance optimization
// Single field indexes
InsuranceClaimSchema.index({ patient: 1 });
InsuranceClaimSchema.index({ status: 1 });
InsuranceClaimSchema.index({ serviceCategory: 1 });
InsuranceClaimSchema.index({ insurer: 1 });
InsuranceClaimSchema.index({ createdAt: -1 });
InsuranceClaimSchema.index({ authorizationCode: 1 });
InsuranceClaimSchema.index({ approvalCode: 1 });
InsuranceClaimSchema.index({ lab: 1 });
InsuranceClaimSchema.index({ radiology: 1 });
InsuranceClaimSchema.index({ procedure: 1 });
InsuranceClaimSchema.index({ pharmacy: 1 });
InsuranceClaimSchema.index({ histopathology: 1 });

// Compound indexes for common query patterns
InsuranceClaimSchema.index({ patient: 1, status: 1 });
InsuranceClaimSchema.index({ status: 1, createdAt: -1 });
InsuranceClaimSchema.index({ serviceCategory: 1, status: 1 });
InsuranceClaimSchema.index({ insurer: 1, status: 1 });

export default mongoose.model<IInsuranceClaim>(
  "InsuranceClaim",
  InsuranceClaimSchema
);
