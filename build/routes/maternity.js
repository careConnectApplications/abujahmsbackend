"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firststageLabour_1 = __importDefault(require("./maternity/firststageLabour"));
const secondstageLabour_1 = __importDefault(require("./maternity/secondstageLabour"));
const thirdstageLabour_1 = __importDefault(require("./maternity/thirdstageLabour"));
const birthregister_1 = __importDefault(require("./maternity/birthregister"));
const postnatalcare_1 = __importDefault(require("./maternity/postnatalcare"));
const mortalityregister_1 = __importDefault(require("./maternity/mortalityregister"));
const router = (0, express_1.Router)();
// Mount all maternity sub-routes
router.use("/first-stage-labour", firststageLabour_1.default);
router.use("/second-stage-labour", secondstageLabour_1.default);
router.use("/third-stage-labour", thirdstageLabour_1.default);
router.use("/birth-register", birthregister_1.default);
router.use("/postnatal-care", postnatalcare_1.default);
router.use("/mortality-register", mortalityregister_1.default);
exports.default = router;
