import mongoose, { Schema } from "mongoose";

const histopathologyExamFormSchema = new Schema(
    {
        histopathologyId: {
            type: Schema.Types.ObjectId,
            ref: "Histopathology",
            required: [true, "Histopathology id is required"]
        },
        serviceName: { type: String, trim: true },
        testTypeId: { type: String, required: [true, "please provide a exam/test type"] },
        firstDayLMP: { type: Date, default: null },
        postMenopausal: { type: Boolean, default: null },
        oralContraceptive: { type: String, },
        IUDInPlace: { type: String },
        parity: { type: Number },
        pregnant: { type: String },
        postpartum: { type: String },
        hysterectomy: { type: String },
        LiquidPrep: { type: String },
        CytoBrush: { type: String },
        RoutinePap: { type: String },
        Previous: { type: String },
        cytologyReport: {
            adequancy: { type: String },
            hormEvaluation: { type: String },
            microbialFlora: { type: String },
            specialFeatures: { type: String },
            diagnosis: { type: String },
            hpvResults: { type: String },
            recommendation: { type: String }
        },
        pathologistReport: {
            macro: { type: String },
            micro: { type: String },
            diagnosis: { type: String },
            comment: { type: String },
            sonographicFindings: { type: String }
        }
    },
    { timestamps: true }
);

histopathologyExamFormSchema.pre<any>(/^find/, function (next) {
    this.populate({
        path: "histopathologyId",
    });
    next();
});

const HistopathologyExamForm = mongoose.model("HistopathologyExamForm", histopathologyExamFormSchema);
export default HistopathologyExamForm;