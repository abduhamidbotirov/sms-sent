import express from "express";
import excelRouter from "./uploadExcel/excel.routes.js";
const router = express.Router();
router.use('/test', () => { });
router.use("/excel", excelRouter)
export default router