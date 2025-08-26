import configuration from "../../config";
import {
  readallhmocategorycover,
  createhmocategorycover,
  readonehmocategorycover,
  updatehmocategorycover
} from "../../dao/hmocategorycover";
import {readonehmomanagement} from "../../dao/hmomanagement";
import { validateinputfaulsyvalue } from "../../utils/otherservices";
import { createaudit } from "../../dao/audit";
import {readoneservicetype} from "../../dao/servicetype";
// Create HMO Category Cover
export var createhmocategorycovercontroller = async (req: any, res: any) => {
  try {
    const { hmoId, category, isprimaryhmo, hmopercentagecover} = req.body;
    const { firstName, lastName } = (req.user).user;
    var actor = `${firstName} ${lastName}`;

    validateinputfaulsyvalue({ hmoId, category, hmopercentagecover });
    const foundHmo = await readonehmomanagement({ _id:hmoId }, '');
    //update servicetype for New Patient Registration
    if (!foundHmo) {
      throw new Error(`HMO does not exist`);

    }
    //validate category
    
            //update servicetype for New Patient Registration
          
 if(!(configuration.category).includes(category)){
             
    throw new Error(`service category does not exist`);
    
}

    // Check if category already exists for same HMO
    const foundCover = await readonehmocategorycover({ hmoId, category,hmopercentagecover }, "");
    if (foundCover) {
      throw new Error(`HMO Category Cover already exists`);
    }

    const queryresult = await createhmocategorycover({
      hmoId:foundHmo._id,
      category,
      isprimaryhmo,
      hmopercentagecover,
      createdBy: actor
    });

    await createaudit({
      action: "Create HMO Category Cover",
      actor,
      affectedentity: `${category} - ${hmoId}`
    });

    res.status(200).json({ queryresult, status: true });

  } catch (error: any) {
    console.log(error);
    res.status(403).json({ status: false, msg: error.message });
  }
};

// Get all HMO Category Covers
export async function getallhmocategorycovercontroller(req: any, res: any) {
  try {
    const queryresult = await readallhmocategorycover({}, "");
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (e: any) {
    res.status(403).json({ status: false, msg: e.message });
  }
}

// Update HMO Category Cover
export async function updatehmocategorycovercontroller(req: any, res: any) {
  try {
    const { _id } = req.params;
    const { hmoId, category, isprimaryhmo, hmopercentagecover } = req.body;
    const { firstName, lastName } = (req.user).user;
    var actor = `${firstName} ${lastName}`;

    validateinputfaulsyvalue({ _id, hmoId, category, hmopercentagecover });
    const foundHmo = await readonehmomanagement({ _id:hmoId }, '');
    //update servicetype for New Patient Registration
    if (!foundHmo) {
      throw new Error(`HMO does not exist`);

    }

    await createaudit({
      action: "Update HMO Category Cover",
      actor,
      affectedentity: `${category} - ${hmoId}`
    });

    const queryresult = await updatehmocategorycover(_id, {
      hmoId:foundHmo._id,
      category,
      isprimaryhmo,
      hmopercentagecover
    });

    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });
  }
}
