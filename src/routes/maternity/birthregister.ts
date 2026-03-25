import { Router } from "express";
import birthRegisterController from "../../controllers/maternity/birthregister";
import { protect } from "../../utils/middleware";

const router = Router();

// Create new birth register record
router.post(
  "/create",
  protect,
  birthRegisterController.createBirthRegister
);

// Get all birth register records
router.get(
  "/getall",
  protect,
  birthRegisterController.getBirthRegister
);

// Get birth register by ID
router.get(
  "/get/:id",
  protect,
  birthRegisterController.getBirthRegisterById
);

// Get birth register by patient ID
router.get(
  "/patient/:patientId",
  protect,
  birthRegisterController.getBirthRegisterByPatientId
);

// Update birth register record
router.put(
  "/update/:id",
  protect,
  birthRegisterController.updateBirthRegister
);



// Get paginated birth register records
router.get(
  "/paginated",
  protect,
  birthRegisterController.getBirthRegisterPaginated
);


// Get birth register count


export default router;
