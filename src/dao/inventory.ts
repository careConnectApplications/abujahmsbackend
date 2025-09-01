import Inventory from "../models/inventory";
import configuration from "../config";

  //read all patient history
  export async function readallinventory(query:any,selectquery:any) {
    try {
      const inventorydetails = await Inventory.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalinventorydetails = await Inventory.find(query).countDocuments();
      return { inventorydetails, totalinventorydetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve inventory data");
    }
  };
  export async function createinventory(input:any){
    try{
      //console.log('///////////',input);
       const inventory = new Inventory(input);
        return await inventory.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create inventory");

    }
  }
  //find one
  export async function readoneinventory(query:any,selectquery:any){
    try{
    return await Inventory.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve inventory data");

    }
  }
  
 
  
  //update  inventory  by id
  export async function updateinventory(id:any, reqbody:any){
    try{
    const inventory = await Inventory.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!inventory) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return inventory;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update inventory");

    }

  }
  //update  appointment by query
  export async function updateinventoryquery(query:any, reqbody:any){
    try{
    const inventory = await Inventory.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!inventory) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return inventory;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update inventory");

    }

  }
  