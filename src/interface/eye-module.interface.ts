import mongoose, { Model, Types, Document } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface EyeSide {
    OD?: string;
    OS?: string;
}

export interface EyeMeasurement {
    sphere?: string;
    cyl?: string;
    axis?: string;
    prism?: string;
    va?: string; // Visual Acuity
}

export interface OptometryLensPrescription {
    distance: {
        right: EyeMeasurement;
        left: EyeMeasurement;
    };
    add: {
        right?: string;
        left?: string;
    };
    ipd: {
        near?: string;
        dist?: string;
    };
    lensTint?: string;
    lensSize?: string;
    segHt?: string;
    temple?: string;
    lensType?: string;
    frame?: string;
    colour?: string;
    remarks?: string;
    nextExamDate?: Date | null;
    nextAppointmentDate?: Date | null;
}

export interface PreliminaryTest {
    visualAcuityUnaided?: {
        far?: { DIST?: string; OD?: string; OS?: string; OU?: string };
        near?: { DIST?: string; OD?: string; OS?: string; OU?: string };
        pH?: { DIST?: string; OD?: string; OS?: string; OU?: string };
    };
    visualAcuityAided?: {
        far?: { OD?: string; OS?: string; OU?: string };
        near?: { OD?: string; OS?: string; OU?: string };
        pH?: { OD?: string; OS?: string; OU?: string };
    };
    countingFingers?: { OD?: string; OS?: string };
    handMovement?: { OD?: string; OS?: string };
    lightPerception?: { OD?: string; OS?: string };
    noLightPerception?: { OD?: string; OS?: string };
    lightProjection?: {
        OD?: { top?: string; bottom?: string; left?: string; right?: string };
        OS?: { top?: string; bottom?: string; left?: string; right?: string };
    };
    pachymetry?: {
        OD?: { name?: string; date?: Date | null };
        OS?: { name?: string; date?: Date | null };
    };
    tonometry?: {
        OD?: { name?: string; methodOrTime?: Date | null };
        OS?: { name?: string; methodOrTime?: Date | null };
    };
    glaucomaFlowsheet?: {
        visualFields?: { OD?: string; OS?: string };
        cupDiskRatio?: { OD?: string; OS?: string };
        iop?: { OD?: string; OS?: string };
    };
    pupillaryDistance?: {
        far?: { OD?: string; OS?: string; OU?: string };
        near?: { OD?: string; OS?: string; OU?: string };
    };
    fieldsFull?: { OD?: string; OS?: string };
    fieldsRestricted?: { OD?: string; OS?: string };
    distance?: { reading?: string; work?: string };
    eyeColour?: string;
    hyperEye?: string;
    npc?: string;
    stereopsis?: string;
}

export interface OphthalmologyExamination {
    slitLamp?: {
        adnexa?: EyeSide;
        lids?: EyeSide;
        tearBreak?: EyeSide;
        conjunctiva?: EyeSide;
        cornea?: EyeSide;
        antChamber?: EyeSide;
        depth?: EyeSide;
        cells?: EyeSide;
        flare?: EyeSide;
        iris?: EyeSide;
        colour?: EyeSide;
        angles?: EyeSide;
        pupil?: EyeSide;
        lens?: EyeSide;
        clarity?: EyeSide;
        antCaps?: EyeSide;
        postCaps?: EyeSide;
        cortex?: EyeSide;
        nucleus?: EyeSide;
    };
    ophthalmoscopy?: {
        opticDisc?: EyeSide;
        size?: EyeSide;
        ratio?: EyeSide;
        appearance?: EyeSide;
        nerveFiber?: EyeSide;
        retina?: EyeSide;
        macula?: EyeSide;
        postRetina?: EyeSide;
        vessels?: EyeSide;
        periphery?: EyeSide;
        vitreous?: EyeSide;
    };
    refraction?: {
        sphere?: EyeSide;
        cyl?: EyeSide;
        axis?: EyeSide;
        add?: EyeSide;
        hPrism?: EyeSide;
        hBase?: EyeSide;
        vPrism?: EyeSide;
        vBase?: EyeSide;
        vc?: EyeSide;
        bcva?: EyeSide;
    };
    phorias?: {
        distAt?: { unnamed?: string; horizontal?: string; vertical?: string; base?: string; refEye?: string };
        nearAt?: { unnamed?: string; horizontal?: string; vertical?: string; base?: string; refEye?: string };
        method?: { input1?: string; input2?: string };
    };
    nextAppointmentDate?: Date | null;
}

export enum OperationalTestType {
  CVF = 'CVF',
  OCT = 'OCT',
  FundusPhotograph = 'FundusPhotograph',
  FFA = 'FFA'
}

export interface OphthalmologyOperationalTest {
  resultType: OperationalTestType;
  fileUrl: string;
  uploadedAt?: Date;
  uploadedBy: string;
}

export interface IEyeModule {
  patient: string | mongoose.Types.ObjectId;
  ref?: string;
  appointment?: string | mongoose.Types.ObjectId | null;
  appointmentid: string;
  createdBy?: string | mongoose.Types.ObjectId | null;
  updatedBy?: string | mongoose.Types.ObjectId | null;
  status: string;
  optometryLensPrescription?: OptometryLensPrescription | null;
  preliminaryTest?: PreliminaryTest | null;
  examination?: OphthalmologyExamination | null;
  operationalTest?: OphthalmologyOperationalTest[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEyeModuleDoc extends IEyeModule, Document {
  _id: string;
}

export interface IEyeModel extends Model<IEyeModuleDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}