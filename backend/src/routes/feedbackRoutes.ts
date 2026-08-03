import express from "express"
import { protect,authorize } from "../middleware/auth";
import { addFeedback,getMyChildFeedback,getStudentFeedback,getAllFeedback,feedbackUpdate,deleteFeedback } from "../controllers/feedbackController";

const router = express.Router();

router.post('/', protect, authorize('ADMIN', 'TEACHER'), addFeedback)
router.get('/mychild', protect, getMyChildFeedback)
router.get('/all', protect, authorize('ADMIN'), getAllFeedback)
router.get('/:studentId', protect, getStudentFeedback)
router.put('/:id', protect, authorize('TEACHER', 'ADMIN'), feedbackUpdate)
router.delete('/:id', protect, authorize('TEACHER', 'ADMIN'), deleteFeedback)

export default router