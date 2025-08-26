import HmoCategoryCover from "../models/hmocategorycover";
import configuration from "../config";

// Read all HMO Category Covers
export async function readallhmocategorycover(query: any, selectquery: any) {
  try {
    const hmocategorycoverdetails = await HmoCategoryCover.find(query)
      .select(selectquery)
      .populate("hmoId")
      .sort({ createdAt: -1 });

    const totalhmocategorycoverdetails = await HmoCategoryCover.find(query).countDocuments();

    return { hmocategorycoverdetails, totalhmocategorycoverdetails };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to retrieve HMO category cover data");
  }
}

// Create new HMO Category Cover
export async function createhmocategorycover(input: any) {
  try {
    const hmocategorycover = new HmoCategoryCover(input);
    return await hmocategorycover.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create HMO category cover");
  }
}

// Find one HMO Category Cover
export async function readonehmocategorycover(query: any, selectquery: any) {
  try {
    return await HmoCategoryCover.findOne(query).select(selectquery).populate("hmoId");
  } catch (err) {
    console.log(err);
    throw new Error("Failed to retrieve HMO category cover data");
  }
}

// Update by ID
export async function updatehmocategorycover(id: any, reqbody: any) {
  try {
    const hmocategorycover = await HmoCategoryCover.findOneAndUpdate(
      { _id: id },
      reqbody,
      { new: true }
    );
    if (!hmocategorycover) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return hmocategorycover;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update HMO category cover");
  }
}

// Update by query
export async function updatehmocategorycoverbyquery(query: any, reqbody: any) {
  try {
    const hmocategorycover = await HmoCategoryCover.findOneAndUpdate(
      query,
      reqbody,
      { new: true }
    );
    if (!hmocategorycover) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return hmocategorycover;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update HMO category cover");
  }
}
