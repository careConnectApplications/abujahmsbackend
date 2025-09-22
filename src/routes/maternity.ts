import { Router } from "express";
import firstStageLabourRoutes from "./maternity/firststageLabour";
import secondStageLabourRoutes from "./maternity/secondstageLabour";
import thirdStageLabourRoutes from "./maternity/thirdstageLabour";
import birthRegisterRoutes from "./maternity/birthregister";
import postnatalCareRoutes from "./maternity/postnatalcare";
import mortalityRegisterRoutes from "./maternity/mortalityregister";

const router = Router();

// Mount all maternity sub-routes
router.use("/first-stage-labour", firstStageLabourRoutes);
router.use("/second-stage-labour", secondStageLabourRoutes);
router.use("/third-stage-labour", thirdStageLabourRoutes);
router.use("/birth-register", birthRegisterRoutes);
router.use("/postnatal-care", postnatalCareRoutes);
router.use("/mortality-register", mortalityRegisterRoutes);

export default router;
