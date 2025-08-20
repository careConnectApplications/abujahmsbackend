import mongoose, { Schema } from "mongoose";
import configuration from "../config";
import { IHistopathologyDoc, IHistopathologyModel } from "../interface/histopathology.interface";
import { paginate } from "../paginate";

const consentFormSchema = new Schema({
    nameofexplainer: {
        type: String,
       // required: true,
    },
    filename: String,
    nameofrepresentive:
    {
        type: String,
       // required: true,
    },
    addressofrepresentaive: {
        type: String,
        //required: true,
    },
    fullnameofwitness: {
        type: String,
        //required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
}, { timestamps: true });

const histopathologySchema = new Schema<IHistopathologyDoc, IHistopathologyModel>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patientsmanagement",
            required: [true, "Patient id is required"]
        },
        // appointment: {
        //     type: Schema.Types.ObjectId,
        //     ref: "Appointment",
        //     default: null,
        // },
        // appointmentid:
        // {
        //     type: String,
        //     required: true
        // },
        staffInfo: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            default: null,
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        },
        amount: {
            type: Number,
            min: [0, "Amount cannot be negative"],
        },
        hmopercentagecover:Number,
        actualcost:Number,
        paymentStatus: {
            type: String,
            default: configuration.status[2],
        },
        status: {
            required: true,
            type: String,
            default: configuration.status[5],
        },
        refNumber:String,
        testRequired: [{
            name: { type: String, required: true, trim: true },
            PaymentRef: {
                type: Schema.Types.ObjectId,
                ref: "Payment",
                default: null
            },
            amount: { type: Number, min: [0, "Amount cannot be negative"] },
            paymentStatus: { type: String, default: configuration.status[5] }
        }],
        diagnosisForm: {
            //provisionalDiagnosis: { type: String, required: true },
            //clinicalDetails: { type: String },
            lmp: { type: String },
            // parity: { type: String },
            biopsyType: { type: String, enum: ["Excision", "Incision", "Endoscopy", "Trucut"], default: null },
            others: { type: String, trim: true },
            wholeOrgan: { type: String, trim: true },
            operationalOrEndoscopyFinding: { type: String, trim: true },
            radiologicalResults: { type: String, trim: true },
            otherLabResults: { type: String, trim: true },
            previousBiopsy: { type: Boolean, required: [true, "Previous Biopsy is required"] },
            diagnosis: { type: String, trim: true },
            labNo: { type: String, trim: true },
            requestingDoctor: {
                type: Schema.Types.ObjectId,
                ref: "Users",
                default: null,
            },
            phoneNumber: {
                type: String,
                trim: true,
                default: null
            }
        },
        consentForm: {
            type: consentFormSchema,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

histopathologySchema.virtual('examForms', {
    ref: 'HistopathologyExamForm',
    localField: '_id',
    foreignField: 'histopathologyId',
    justOne: false
});

histopathologySchema.pre<IHistopathologyDoc>(/^find/, function (next) {
    this.populate({
        path: "patient staffInfo diagnosisForm.requestingDoctor",
    });
    next();
});

histopathologySchema.plugin(paginate as any);

const Histopathology = mongoose.model<IHistopathologyDoc, IHistopathologyModel>("Histopathology", histopathologySchema);
export default Histopathology;