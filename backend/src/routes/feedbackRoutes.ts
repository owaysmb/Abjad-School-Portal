import express from "express"
import { protect,authorize } from "../middleware/auth";
import { addFeedback,getMyChildFeedback,getStudentFeedback } from "../controllers/feedbackController";

const router = express.Router();

router.post('/',protect,authorize("ADMIN"),addFeedback);
router.get('/:studentId',protect,getStudentFeedback);
router.get('/mychild', protect,getMyChildFeedback );

export default router