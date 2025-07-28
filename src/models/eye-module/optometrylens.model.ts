import mongoose, { Schema } from "mongoose";

const optometryLensSchema = new Schema({

}, { timestamps: true });

const optometryLens = mongoose.model("OptometryLens", optometryLensSchema);
export default optometryLens;