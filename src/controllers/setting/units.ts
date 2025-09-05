import { types } from "util";
import configuration from "../../config";
import { readallunits, createunit, readoneunit, readunitsbyclinic, updateunit, updateunitbyquery } from "../../dao/units";
import { readoneclinic } from "../../dao/clinics";
import { validateinputfaulsyvalue, generateRandomNumber } from "../../utils/otherservices";
import { createaudit } from "../../dao/audit";

// add unit
export var createunits = async (req: any, res: any) => {

  try {

    const { unit, clinicId } = req.body;
    const { firstName, lastName } = (req.user).user;
    var actor = `${firstName} ${lastName}`;
    validateinputfaulsyvalue({ unit, clinicId });

    // Check if the clinic exists
    const foundClinic = await readoneclinic({ _id: clinicId }, '');
    if (!foundClinic) {
      throw new Error(`Clinic with ID ${clinicId} does not exist`);
    }

    var id = `${unit[0]}${generateRandomNumber(5)}${unit[unit.length - 1]}`;
    const foundUnit = await readoneunit({ unit, clinicId }, '','');
    
    // Check if unit already exists for this clinic
    if (foundUnit) {
      throw new Error(`Unit already exists for this clinic`);
    }
    
    const queryresult = await createunit({ unit, clinicId,id });
    //create audit log
    await createaudit({ action: "Created Unit", actor, affectedentity: `${unit} for clinic ${foundClinic.clinic}` });
    res.status(200).json({ queryresult, status: true });

  } catch (error: any) {
    console.log(error);
    res.status(403).json({ status: false, msg: error.message });
  }
}

// read all units
export async function getallunits(req: Request, res: any) {
  try {

    const queryresult = await readallunits({}, '','clinicId',);
    res.status(200).json({
      queryresult,
      status: true
    });

  }
  catch (e: any) {
    res.status(403).json({ status: false, msg: e.message });
  }
}

// get units by clinic
export async function getunitsbyclinic(req: any, res: any) {
  try {

    const { clinicId } = req.params;
    validateinputfaulsyvalue({ clinicId });
    
    const queryresult = await readunitsbyclinic(clinicId, '', 'clinicId');
    res.status(200).json({
      queryresult,
      status: true
    });

  }
  catch (e: any) {
    res.status(403).json({ status: false, msg: e.message });
  }
}

export async function getunitsbyclinicname(req: any, res: any) {
  try {

    const { clinic } = req.params;
    validateinputfaulsyvalue({ clinic });
     const foundClinic:any = await readoneclinic({ clinic }, '');
    if (!foundClinic) {
      throw new Error(`Clinic with name ${clinic} does not exist`);
    }
    
    const queryresult = await readunitsbyclinic(foundClinic._id, '', 'clinicId');
    res.status(200).json({
      queryresult,
      status: true
    });

  }
  catch (e: any) {
    res.status(403).json({ status: false, msg: e.message });
  }
}

// update a unit
export async function updateunits(req: any, res: any) {
  try {
    //get id
    const { id } = req.params;
    const { unit, clinicId } = req.body;
    const { firstName, lastName } = (req.user).user;
    var actor = `${firstName} ${lastName}`;
    validateinputfaulsyvalue({ unit, id });
    
    // If clinicId is being updated, check if the new clinic exists
    if (clinicId) {
      const foundClinic = await readoneclinic({ _id: clinicId }, '');
      if (!foundClinic) {
        throw new Error(`Clinic with ID ${clinicId} does not exist`);
      }
    }
    
    var queryresult = await updateunit(id, { unit,  clinicId });
    await createaudit({ action: "Update Unit", actor, affectedentity: unit });
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });
  }
}
