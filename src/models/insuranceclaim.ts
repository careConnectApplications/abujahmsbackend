import mongoose, { Schema, Document } from "mongoose";

export interface IInsuranceClaim extends Document {
  patient: mongoose.Types.ObjectId;
  serviceCategory: string;
  lab?: mongoose.Types.ObjectId;
  radiology?: mongoose.Types.ObjectId;
  procedure?: mongoose.Types.ObjectId;
  pharmacy?: mongoose.Types.ObjectId;
  authorizationCode?: string;
  approvalCode?: string;
  status: "Submitted" | "Re-submitted" | "Cancelled" | "Rejected" | "Paid";
  amountClaimed: number;
  amountApproved?: number;
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
    authorizationCode: { type: String },
    approvalCode: { type: String },
    status: {
      type: String,
      enum: ["Submitted", "Re-submitted", "Cancelled", "Rejected", "Paid"],
      default: "Submitted",
    },
    amountClaimed: { type: Number, required: true },
    amountApproved: { type: Number },
    insurer: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IInsuranceClaim>(
  "InsuranceClaim",
  InsuranceClaimSchema
);
