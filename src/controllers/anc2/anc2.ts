import { updateanc, createanc, readallanc, readoneanc } from "../../dao/anc2";
import { readallancfollowup, updateancfollowup, createancfollowup } from "../../dao/ancfollowup";
import { validateinputfaulsyvalue, isObjectAvailable } from "../../utils/otherservices";
import { readonepatient } from "../../dao/patientmanagement";
import configuration from "../../config";
//get lab order by patient
///////////////////////////anc followup/////////////////////////
export const readAllancfollowupByAncv2 = async (req: any, res: any) => {
  try {
    const { anc } = req.params;
    const queryresult = await readallancfollowup({ anc }, {}, '');
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};


export const createancfollowupsv2 = async (req: any, res: any) => {
  try {
    const { anc } = req.params;
    console.log('anc', anc);
    const { firstName, lastName } = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var { ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname } = req.body;
    validateinputfaulsyvalue({ ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
    //frequency must inlcude
    //route must contain allowed options

    const ancrecord: any = await readoneanc({ _id: anc }, {}, '');
    //console.log(admissionrecord);   
    if (!ancrecord) {
      throw new Error(`ANC donot ${configuration.error.erroralreadyexit}`);

    }
    const queryresult = await createancfollowup({ anc: ancrecord._id, ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
    res.status(200).json({ queryresult, status: true });
  }
  catch (e: any) {
    res.status(403).json({ status: false, msg: e.message });

  }
}


//insulin

export async function updateancfollowupsv2(req: any, res: any) {
  try {
    //get id
    const { id } = req.params;
    const { firstName, lastName } = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var { ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname } = req.body;
    validateinputfaulsyvalue({ ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
    var queryresult = await updateancfollowup(id, { ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

  }

}



////////////////////////////////anc////////////////////////////
export const readAllancByPatientv2 = async (req: any, res: any) => {
  try {
    //const {clinic} = (req.user).user;
    const { patient } = req.params;
    //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
    const queryresult = await readallanc({ patient }, {}, 'patient');
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};

export const createancsv2 = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = (req.user).user;
    const staffname = `${firstName} ${lastName}`;
    const { presentingcomplaints, historyofpresentingcomplaints, historyofindexpregnancy, gynaehistory, passsurgicalhistory, drughistory, familyandsocialhistory, systematicreview, generalmedicalhistory } = req.body;
    const { bookingstatus, lmp, edd, gravidity, ega, lcb } = req.body;
    const reproductiveprofile = { bookingstatus, lmp, edd, gravidity, ega, lcb };
    const { pastobstetrichistory } = req.body;

    //frequency must inlcude
    //route must contain allowed options
    const patientrecord: any = await readonepatient({ _id: id }, {}, '', '');
    //console.log(admissionrecord);   
    if (!patientrecord) {
      throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);

    }
    const queryresult = await createanc({ patient: patientrecord._id, generalmedicalhistory, reproductiveprofile, pastobstetrichistory, presentingcomplaints, historyofpresentingcomplaints, historyofindexpregnancy, gynaehistory, passsurgicalhistory, drughistory, familyandsocialhistory, systematicreview, staffname });
    res.status(200).json({ queryresult, status: true });
  }
  catch (e: any) {
    res.status(403).json({ status: false, msg: e.message });

  }
}

export async function updateancsv2(req: any, res: any) {

  try {
    //
    const { id } = req.params;
    const { firstName, lastName } = (req.user).user;
    const staffname = `${firstName} ${lastName}`;
    const { presentingcomplaints, historyofpresentingcomplaints, historyofindexpregnancy, gynaehistory, passsurgicalhistory, drughistory, familyandsocialhistory, systematicreview } = req.body;
    const { bookingstatus, lmp, edd, gravidity, ega, lcb } = req.body;
    const reproductiveprofile = { bookingstatus, lmp, edd, gravidity, ega, lcb };
    const { pastobstetrichistory } = req.body;

    //validateinputfaulsyvalue({...vitals});
    var queryresult = await updateanc(id, { reproductiveprofile, pastobstetrichistory, presentingcomplaints, historyofpresentingcomplaints, historyofindexpregnancy, gynaehistory, passsurgicalhistory, drughistory, familyandsocialhistory, systematicreview, staffname });
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

  }


}
