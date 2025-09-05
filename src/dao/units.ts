import Unit from "../models/units";
import configuration from "../config";

// read all units
export async function readallunits(query: any, selectquery: any,populatesecondquery:any) {
  try {
    const unitdetails = await Unit.find(query).select(selectquery).populate(populatesecondquery).sort({ createdAt: -1 });
    const totalunitdetails = await Unit.find(query).countDocuments();
    return { unitdetails, totalunitdetails };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to retrieve unit data");
  }
};

// create unit
export async function createunit(input: any) {
  try {
    console.log('//////////', input);
    const unit = new Unit(input);
    return await unit.save();
  }
  catch (err) {
    console.log(err);
    throw new Error("Failed to create unit");
  }
}

// find one unit
export async function readoneunit(query: any, selectquery: any,populatesecondquery:any) {
  try {
    return await Unit.findOne(query).select(selectquery).populate(populatesecondquery);
  }
  catch (err) {
    console.log(err);
    throw new Error("Failed to retrieve unit data");
  }
}

// read units by clinic
export async function readunitsbyclinic(clinicId: string, selectquery: any,populatesecondquery:any) {
  try {
    const unitdetails = await Unit.find({ clinicId }).select(selectquery).populate(populatesecondquery).sort({ createdAt: -1 });
    const totalunitdetails = await Unit.find({ clinicId }).countDocuments();
    return { unitdetails, totalunitdetails };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to retrieve units by clinic");
  }
}

// update unit by id
export async function updateunit(id: any, reqbody: any) {
  try {
    const unit = await Unit.findOneAndUpdate({ _id: id }, reqbody, {
      new: true
    });

    if (!unit) {
      //return json  false response
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return unit;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update unit");
  }
}

// update unit by query
export async function updateunitbyquery(query: any, reqbody: any) {
  try {
    const unit = await Unit.findOneAndUpdate(query, reqbody, {
      new: true
    });
    if (!unit) {
      //return json  false response
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return unit;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update unit");
  }
}
