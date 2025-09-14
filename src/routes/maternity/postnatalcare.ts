import { Router } from "express";
import postnatalCareController from "../../controllers/maternity/postnatalcare";
import { protect } from "../../utils/middleware";

const router = Router();

// Create new postnatal care record
router.post(
  "/create",
  protect,
  postnatalCareController.createPostnatalCare
);

// Get all postnatal care records
router.get(
  "/getall",
  protect,
  postnatalCareController.getPostnatalCare
);

// Get postnatal care by ID
router.get(
  "/get/:id",
  protect,
  postnatalCareController.getPostnatalCareById
);

// Get postnatal care by patient ID
router.get(
  "/patient/:patientId",
  protect,
  postnatalCareController.getPostnatalCareByPatientId
);

// Update postnatal care record
router.put(
  "/update/:id",
  protect,
  postnatalCareController.updatePostnatalCare
);

// Get paginated postnatal care records
router.get(
  "/paginated",
  protect,
  postnatalCareController.getPostnatalCarePaginated
);

// Aggregate postnatal care data
router.get(
  "/aggregate",
  protect,
  postnatalCareController.aggregatePostnatalCare
);

// Get postnatal care count
router.get(
  "/count",
  protect,
  postnatalCareController.countPostnatalCare
);

// Get postnatal care statistics
router.get(
  "/statistics",
  protect,
  postnatalCareController.getPostnatalCareStatistics
);

export default router;
