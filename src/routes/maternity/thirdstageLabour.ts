import { Router } from "express";
import thirdStageLabourController from "../../controllers/maternity/thirdstageLabour";
import { protect } from "../../utils/middleware";

const router = Router();

// Create new third stage labour record
router.post(
  "/create",
  protect,
  thirdStageLabourController.createThirdStageLabour
);

// Get all third stage labour records
router.get(
  "/getall",
  protect,
  thirdStageLabourController.getThirdStageLabour
);

// Get third stage labour by ID
router.get(
  "/get/:id",
  protect,
  thirdStageLabourController.getThirdStageLabourById
);

// Get third stage labour by patient ID
router.get(
  "/patient/:patientId",
  protect,
  thirdStageLabourController.getThirdStageLabourByPatientId
);

// Update third stage labour record
router.put(
  "/update/:id",
  protect,
  thirdStageLabourController.updateThirdStageLabour
);



// Get paginated third stage labour records
router.get(
  "/paginated",
  protect,
  thirdStageLabourController.getThirdStageLabourPaginated
);

// Aggregate third stage labour data

export default router;
