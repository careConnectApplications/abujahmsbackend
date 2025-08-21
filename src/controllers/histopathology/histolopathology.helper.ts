
import { v4 as uuidv4 } from 'uuid';
import configuration from "../../config";
import { uploadbase64image } from "../../utils/otherservices";
import { calculateAmountPaidByHMO } from "../../utils/otherservices";
import { createpayment } from "../../dao/payment";
import { readoneprice } from "../../dao/price";
import {
    CreateHistopatholgyDao
} from "../../dao/histopathology.dao";
// context

const generateRefNumber = () => {
    const uniqueHistopathologyId = uuidv4();
    return `histo-${new Date().getFullYear()}-${uniqueHistopathologyId}`;
}

const generateLabNumber = () => {
    const uniqueHistopathologyId = uuidv4();
    return `Lab-${new Date().getFullYear()}-${uniqueHistopathologyId}`;
}
export const HistopathologyCreationContext = (strategyFn: (args: any) => Promise<any>) => ({
  execute: async (args: any) => strategyFn(args)
});

// HMO strategy
export const HMOHistopathologyCreationStrategy = async ({
  req,
  next,
  _patientId,
  foundPatient,
  hmopercentagecover,
  examTypes,
  userId,
  _doctorId,
  lmp,
  biopsyType,
  wholeOrgan,
  previousBiopsy,
  diagnosis,
  imageBase64,
  nameofexplainer,
  nameofrepresentive,
  addressofrepresentaive,
  fullnameofwitness,
}: any) => {
  let fileName;
  if (imageBase64) fileName = await uploadbase64image(imageBase64);

  let totalAmount = 0;
  let actualcost = 0;
  const testRequiredRecords: any[] = [];
  const refNumber = generateRefNumber();

  for (let i = 0; i < examTypes.length; i++) {
    const service = examTypes[i];
    const testPrice: any = await readoneprice({ servicetype: service });
    if (!testPrice) return next(new Error(`${configuration.error.errornopriceset}  ${service}`));

    const serviceAmount = calculateAmountPaidByHMO(
      Number(hmopercentagecover),
      Number(testPrice.amount)
    );
    totalAmount += serviceAmount;
    actualcost += Number(testPrice.amount);

    testRequiredRecords.push({
      amount: serviceAmount,
      name: service,
      PaymentRef: null,
      paymentStatus: configuration.status[5] // Scheduled
    });
  }

  const labNo = generateLabNumber();

  const newHistopathology = {
    patient: _patientId,
    staffInfo: userId,
    amount: totalAmount,
    hmopercentagecover,
    actualcost,
    refNumber,
    status: configuration.otherstatus[0],
    paymentStatus: configuration.status[2],
    testRequired: testRequiredRecords,
    diagnosisForm: {
      lmp: lmp || '',
      biopsyType: biopsyType || null,
      wholeOrgan: wholeOrgan || '',
      previousBiopsy: previousBiopsy,
      diagnosis: diagnosis || '',
      labNo: labNo || '',
      requestingDoctor: _doctorId,
      phoneNumber: foundPatient.phoneNumber || null
    },
    consentForm: {
      nameofexplainer,
      nameofrepresentive,
      filename: fileName,
      addressofrepresentaive,
      fullnameofwitness,
      createdBy: userId
    }
  };

  return await CreateHistopatholgyDao(newHistopathology, next);
};

// SelfPay strategy (uncommented payment code here)
export const SelfPayHistopathologyCreationStrategy = async ({
  req,
  next,
  _patientId,
  foundPatient,
  examTypes,
  userId,
  _doctorId,
  lmp,
  biopsyType,
  wholeOrgan,
  previousBiopsy,
  diagnosis,
  imageBase64,
  nameofexplainer,
  nameofrepresentive,
  addressofrepresentaive,
  fullnameofwitness,
}: any) => {
  let fileName;
  if (imageBase64) fileName = await uploadbase64image(imageBase64);

  let totalAmount = 0;
  const testRequiredRecords: any[] = [];
  const createdPayments: any[] = [];
  const refNumber = generateRefNumber();

  for (let i = 0; i < examTypes.length; i++) {
    const service = examTypes[i];
    const testPrice: any = await readoneprice({ servicetype: service });
    if (!testPrice) return next(new Error(`${configuration.error.errornopriceset}  ${service}`));

    const serviceAmount = testPrice.amount;
    totalAmount += serviceAmount;

    const paymentData = {
      paymentreference: refNumber,
      paymentype: service,
      paymentcategory: configuration.category[6], // Histopathology
      patient: _patientId,
      firstName: foundPatient?.firstName,
      lastName: foundPatient?.lastName,
      MRN: foundPatient?.MRN,
      phoneNumber: foundPatient?.phoneNumber,
      amount: Number(serviceAmount),
    };

    testRequiredRecords.push({
      amount: serviceAmount,
      name: service,
      PaymentRef: null,
      paymentStatus: configuration.status[5], // Scheduled
    });

    createdPayments.push(paymentData);
  }

  // create payments and attach refs
  for (let i = 0; i < createdPayments.length; i++) {
    const paymentRecord = await createpayment(createdPayments[i]);
    testRequiredRecords[i].PaymentRef = paymentRecord._id;
  }

  const labNo = generateLabNumber();

  const newHistopathology = {
    patient: _patientId,
    staffInfo: userId,
    amount: totalAmount,
    refNumber,
    status: configuration.status[5],
    paymentStatus: configuration.status[2],
    testRequired: testRequiredRecords,
    diagnosisForm: {
      lmp: lmp || '',
      biopsyType: biopsyType || null,
      wholeOrgan: wholeOrgan || '',
      previousBiopsy: previousBiopsy,
      diagnosis: diagnosis || '',
      labNo: labNo || '',
      requestingDoctor: _doctorId,
      phoneNumber: foundPatient.phoneNumber || null
    },
    consentForm: {
      nameofexplainer,
      nameofrepresentive,
      filename: fileName,
      addressofrepresentaive,
      fullnameofwitness,
      createdBy: userId
    }
  };

  return await CreateHistopatholgyDao(newHistopathology, next);
};

// Controller/service
