import express from 'express';
import {
  history,
  marketplace,
  runAssessment,
  simulateScenario
} from '../controllers/assessmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/marketplace', protect, marketplace);
router.get('/history', protect, history);
router.post('/run', protect, runAssessment);
router.post('/simulate', protect, simulateScenario);

export default router;
