import Bed from "../models/beds";
import configuration from "../config";

// Create a bed
export async function createbed(input: any) {
  try {
    const bed = new Bed(input);
    return await bed.save();
  } catch (err) {
    console.log(err);
    throw new Error(configuration.error.errorusercreate);
  }
}

// Read all beds
export async function readallbeds(query: any, selectquery: any) {
  try {
    const bedDetails = await Bed.find(query).select(selectquery).sort({ createdAt: -1 });
    const totalBeds = await Bed.countDocuments(query);
    return { bedDetails, totalBeds };
  } catch (err) {
    console.log(err);
    throw new Error(configuration.error.erroruserread);
  }
}

// Read one bed
export async function readonebed(query: any, selectquery: any) {
  try {
    return await Bed.findOne(query).select(selectquery);
  } catch (err) {
    console.log(err);
    throw new Error(configuration.error.erroruserread);
  }
}

// Update bed by ID
export async function updatebed(id: any, reqbody: any) {
  try {
    const bed = await Bed.findOneAndUpdate({ _id: id }, reqbody, {
      new: true
    });
    if (!bed) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return bed;
  } catch (err) {
    console.log(err);
    throw new Error(configuration.error.erroruserupdate);
  }
}

// Update bed by query
export async function updatebedbyquery(query: any, reqbody: any) {
  try {
    const bed = await Bed.findOneAndUpdate(query, reqbody, {
      new: true
    });
    if (!bed) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return bed;
  } catch (err) {
    console.log(err);
    throw new Error(configuration.error.erroruserupdate);
  }
}
