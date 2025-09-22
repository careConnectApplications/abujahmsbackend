import { Router } from "express";
import secondStageLabourController from "../../controllers/maternity/secondstageLabour";
import { protect } from "../../utils/middleware";

const router = Router();

// Create new second stage labour record
router.post(
  "/create",
  protect,
  secondStageLabourController.createSecondStageLabour
);

// Get all second stage labour records
router.get(
  "/getall",
  protect,
  secondStageLabourController.getSecondStageLabour
);

// Get second stage labour by ID
router.get(
  "/get/:id",
  protect,
  secondStageLabourController.getSecondStageLabourById
);

// Get second stage labour by patient ID
router.get(
  "/patient/:patientId",
  protect,
  secondStageLabourController.getSecondStageLabourByPatientId
);

// Update second stage labour record
router.put(
  "/update/:id",
  protect,
  secondStageLabourController.updateSecondStageLabour
);

// Get paginated second stage labour records
router.get(
  "/paginated",
  protect,
  secondStageLabourController.getSecondStageLabourPaginated
);



export default router;
