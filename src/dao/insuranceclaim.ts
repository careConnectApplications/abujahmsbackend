import InsuranceClaim from "../models/insuranceclaim";
import configuration from "../config";

// 🔍 Read all insurance claims
export async function readAllInsuranceClaims(
  query = {},
  selectquery = {},
  populatequery = "",
  populatesecondquery = "",
  skip = 0,
  limit = 150
) {
  try {
    const claims = await InsuranceClaim.find(query)
      .select(selectquery)
      .populate(populatequery)
      .populate(populatesecondquery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await InsuranceClaim.countDocuments(query);

    return { claims, total };
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserread);
  }
}

// ➕ Create a new insurance claim
export async function createInsuranceClaim(input: any) {
  try {
    const newClaim = new InsuranceClaim(input);
    return await newClaim.save();
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.errorusercreate);
  }
}

// 🔍 Read one insurance claim
export async function readOneInsuranceClaim(query: any, selectquery = {}) {
  try {
    return await InsuranceClaim.findOne(query).select(selectquery);
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserread);
  }
}

// 🔄 Update claim by ID
export async function updateInsuranceClaimById(id: any, reqbody: any) {
  try {
    const updated = await InsuranceClaim.findOneAndUpdate(
      { _id: id },
      reqbody,
      { new: true }
    );
    if (!updated) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return updated;
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserupdate);
  }
}

// 🔄 Update claim by query
export async function updateInsuranceClaimByQuery(query: any, reqbody: any) {
  try {
    const updated = await InsuranceClaim.findOneAndUpdate(query, reqbody, {
      new: true,
    });
    if (!updated) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return updated;
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserupdate);
  }
}
