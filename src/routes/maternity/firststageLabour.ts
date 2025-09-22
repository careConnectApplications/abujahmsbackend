import { Router } from "express";
import firstStageLabourController from "../../controllers/maternity/firststageLabour";
import { protect } from "../../utils/middleware";

const router = Router();

// Create new first stage labour record
router.post(
  "/create",
  protect,
  firstStageLabourController.createFirstStageLabour
);

// Get all first stage labour records
router.get(
  "/getall",
  protect,
  firstStageLabourController.getFirstStageLabour
);

// Get first stage labour by ID
router.get(
  "/get/:id",
  protect,
  firstStageLabourController.getFirstStageLabourById
);

// Get first stage labour by patient ID
router.get(
  "/patient/:patientId",
  protect,
  firstStageLabourController.getFirstStageLabourByPatientId
);

// Update first stage labour record
router.put(
  "/update/:id",
  protect,
  firstStageLabourController.updateFirstStageLabour
);



// Get paginated first stage labour records
router.get(
  "/paginated",
  protect,
  firstStageLabourController.getFirstStageLabourPaginated
);



export default router;
