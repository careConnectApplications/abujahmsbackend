import { Schema, model } from "mongoose";

const hmoCategoryCoverSchema = new Schema({
  hmoId: {
    type: Schema.Types.ObjectId,
    ref: "Hmomanagement",
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  isprimaryhmo:{
    type: Boolean,
    default: false
  },

  hmopercentagecover: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const HmoCategoryCover = model("HmoCategoryCover", hmoCategoryCoverSchema);
export default HmoCategoryCover;
