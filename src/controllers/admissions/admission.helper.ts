import {updateadmission} from  "../../dao/admissions";
import {updatewardmanagement} from "../../dao/wardmanagement";
import {readallpayment} from "../../dao/payment";
import {updatebed} from "../../dao/bed";
import configuration from "../../config";

const dischargeStrategy = async (admission: any, reqBody: any) => {
  const { dischargeReason, id } = reqBody;

  if (!dischargeReason) {
    throw new Error("Discharge reason must be provided for discharged patients");
  }

  const allowedReasons = ["Recovered", "Improved", "Referred Out", "Death", "Against Medical Advice", "Other"];
  if (!allowedReasons.includes(dischargeReason)) {
    throw new Error("Invalid discharge reason");
  }

  // check payments
  const paymentrecord: any = await readallpayment(
    { paymentreference: admission.admissionid, status: { $ne: configuration.status[3] } },
    ""
  );
  if ((paymentrecord.paymentdetails).length > 0) {
    throw new Error(configuration.error.errorpayment);
  }

  // free bed + update admission
  await Promise.all([
    updatewardmanagement(admission.referedward, { $inc: { occupiedbed: -1, vacantbed: 1 } }),
    updatebed(admission.bed, { status: configuration.bedstatus[0] }),
    updateadmission(id, { status: configuration.admissionstatus[5], dischargeReason }),
  ]);
};




const transferStrategy = async (admission: any, reqBody: any) => {
  const { transfterto, bed_id, id } = reqBody;

  if (!transfterto || !bed_id) {
    throw new Error("Transfer requires target ward and bed");
  }

  await Promise.all([
    updatewardmanagement(admission.referedward, { $inc: { occupiedbed: -1, vacantbed: 1 } }),
    updatewardmanagement(transfterto, { $inc: { occupiedbed: 1, vacantbed: -1 } }),
    updatebed(admission.bed, { status: configuration.bedstatus[0] }),
    updatebed(bed_id, { status: configuration.bedstatus[1] }),
    updateadmission(id, {
      bed: bed_id,
      previousward: admission.referedward,
      referedward: transfterto,
    }),
  ]);
};


export const strategies: Record<string, Function> = {
  [configuration.admissionstatus[5]]: dischargeStrategy,
  [configuration.admissionstatus[3]]: transferStrategy,
};