import { Model, Document, Types } from 'mongoose';
import { QueryResult } from "../paginate/paginate";

export interface CytologyReport {
    adequancy?: string;
    hormEvaluation?: string;
    microbialFlora?: string;
    specialFeatures?: string;
    diagnosis?: string;
    hpvResults?: string;
    recommendation?: string;
}

export interface PathologistReport {
    macro?: string;
    micro?: string;
    diagnosis?: string;
    comment?: string;
    sonographicFindings?: string;
}

export interface IHistopathologyExamForm {
    histopathologyId: Types.ObjectId;
    serviceName?: string;
    testTypeId: string;
    firstDayLMP?: Date | null;
    postMenopausal?: boolean | null;
    oralContraceptive?: string;
    IUDInPlace?: string;
    parity?: number;
    pregnant?: string;
    postpartum?: string;
    hysterectomy?: string;
    LiquidPrep?: string;
    CytoBrush?: string;
    RoutinePap?: string;
    Previous?: string;
    cytologyReport?: CytologyReport;
    pathologistReport?: PathologistReport;
    createdAt: Date;
    updatedAt: Date;
}

export interface IHistopathologyExamFormDoc extends IHistopathologyExamForm, Document {
    _id: string;
}

export interface IHistopathologyExamFormModel extends Model<IHistopathologyExamFormDoc> {
    paginate(
        filter: Record<string, any>,
        options: Record<string, any>
    ): Promise<QueryResult>;
}