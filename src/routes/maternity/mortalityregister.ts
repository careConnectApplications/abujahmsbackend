import { Router } from "express";
import mortalityRegisterController from "../../controllers/maternity/mortalityregister";
import { protect } from "../../utils/middleware";

const router = Router();

// Create new mortality register record
router.post(
  "/create",
  protect,
  mortalityRegisterController.createMortalityRegister
);

// Get all mortality register records
router.get(
  "/getall",
  protect,
  mortalityRegisterController.getMortalityRegister
);

// Get mortality register by ID
router.get(
  "/get/:id",
  protect,
  mortalityRegisterController.getMortalityRegisterById
);

// Get mortality register by patient ID
router.get(
  "/patient/:patientId",
  protect,
  mortalityRegisterController.getMortalityRegisterByPatientId
);

// Update mortality register record
router.put(
  "/update/:id",
  protect,
  mortalityRegisterController.updateMortalityRegister
);



// Get paginated mortality register records
router.get(
  "/paginated",
  protect,
  mortalityRegisterController.getMortalityRegisterPaginated
);

// Aggregate mortality register data
router.get(
  "/aggregate",
  protect,
  mortalityRegisterController.aggregateMortalityRegister
);

// Get mortality register count
router.get(
  "/count",
  protect,
  mortalityRegisterController.countMortalityRegister
);

// Get mortality statistics
router.get(
  "/statistics",
  protect,
  mortalityRegisterController.getMortalityStatistics
);

export default router;
