import express from "express"
import { protect,authorize } from "../middleware/auth";
import { createParent , getAllParents,assignChildToParent, getMyChildren,deleteParent } from "../controllers/parentController";
const router = express.Router();

router.post('/',protect,authorize("ADMIN"),createParent);
router.get('/',protect,getAllParents);
router.post('/assign', protect,authorize("ADMIN"), assignChildToParent);
router.get('/mychildren', protect, authorize('PARENT'), getMyChildren);
router.delete('/:id', protect, authorize('ADMIN'), deleteParent)

export default router

