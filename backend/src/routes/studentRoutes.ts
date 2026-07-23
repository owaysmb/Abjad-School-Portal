import express from "express"
import { protect,authorize } from "../middleware/auth";
import { createStudent , getAllStudents } from "../controllers/studentController";

const router = express.Router();

router.post('/',protect,authorize("ADMIN"),createStudent);
router.get('/',protect,getAllStudents);

export default router

