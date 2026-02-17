const express = require('express');
const router = express.Router();
const { getHistory, getAnalysisById, deleteAnalysis } = require('../controllers/historyController');

// GET /api/history - Get all analyses
router.get('/', getHistory);

// GET /api/history/:id - Get single analysis
router.get('/:id', getAnalysisById);

// DELETE /api/history/:id - Delete analysis
router.delete('/:id', deleteAnalysis);

module.exports = router;
