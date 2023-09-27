import express from "express";
import excelContr from "./excel.contr.js";
const controller = new excelContr()
let router = express.Router();
router.post("/", controller.CreateFile)
export default router;