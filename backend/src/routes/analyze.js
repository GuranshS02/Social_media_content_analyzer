const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { analyzeFile } = require('../controllers/analyzeController');

// POST /api/analyze - Upload and analyze a file
router.post('/', upload.single('file'), analyzeFile);

module.exports = router;
