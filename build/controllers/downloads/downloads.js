"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadtemplates = downloadtemplates;
const config_1 = __importDefault(require("../../config"));
//downloadtemplete
function downloadtemplates(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const downloadtemplatetypes = config_1.default.downloadtemplatetypes;
        //const fileName = req.params.type;
        //const fileName:any = downloadtemplatetypes.map(x => {if(x.type == req.params.type) return x.fileName});
        const fileName = downloadtemplatetypes.filter((x) => { if (x.type == req.params.type)
            return x.fileName; });
        const filePath = `${process.cwd()}/${config_1.default.userdownloadsdirectory}/${fileName[0].fileName}`;
        // Send the file as an attachment to trigger download
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(config_1.default.error.errordownload);
            }
        });
    });
}
