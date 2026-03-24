import { Model, Types, Document } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface IHistopathologyTestRequired {
  name: string;
  PaymentRef?: Types.ObjectId | null;
  paymentStatus?: string;
}

export interface IDiagnosisForm {
  provisionalDiagnosis: string;
  clinicalDetails?: string;
  lmp?: string;
  parity?: string;
  biopsyType?: "Excision" | "Incision" | "Endoscopy" | "Trucut" | null;
  others?: string;
  wholeOrgan?: string;
  operationalOrEndoscopyFinding?: string;
  radiologicalResults?: string;
  otherLabResults?: string;
  previousBiopsy: boolean;
  diagnosis?: string;
  labNo?: string;
  requestingDoctor?: Types.ObjectId | null;
  phoneNumber?: string | null;
}

export interface ILabUse {
  DateReceived?: Date;
  DateInspected?: Date;
  DateGrossed?: Date;
  DatePassed?: Date;
  NumberOfBlocks?: number;
  Action?: string;
  DateRequested?: Date;
  DateReported?: Date;
}

<<<<<<< HEAD
export interface IConsentForm {
  nameofexplainer: string;
  filename?: string;
  nameofrepresentive: string;
  addressofrepresentaive: string;
  fullnameofwitness: string;
  createdBy?: Types.ObjectId | string | null;
  updatedBy?: Types.ObjectId | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}


=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
export interface IHistopathology {
  patient: Types.ObjectId;
  appointment?: Types.ObjectId | null;
  appointmentid: string;
  staffInfo?: Types.ObjectId | null;
  payment?: Types.ObjectId | null;
  amount?: number;
<<<<<<< HEAD
  hmopercentagecover?:number;
  actualcost?:number;
  refNumber:string,
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  paymentStatus?: string;
  status: string;
  testRequired?: IHistopathologyTestRequired[];
  diagnosisForm: IDiagnosisForm;
<<<<<<< HEAD
  consentForm?: IConsentForm | null;
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  LabUse?: ILabUse;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHistopathologyDoc extends IHistopathology, Document {
  _id: string;
}

export interface IHistopathologyModel extends Model<IHistopathologyDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}