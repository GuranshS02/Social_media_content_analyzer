const Analysis = require('../models/Analysis');

/**
 * GET /api/history
 * Get all past analyses
 */
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = await Analysis.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-extractedText'); // Exclude full text for list view

    const total = await Analysis.countDocuments();

    res.json({
      success: true,
      data: analyses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/history/:id
 * Get a single analysis by ID
 */
const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ success: true, data: analysis });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/history/:id
 * Delete an analysis
 */
const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findByIdAndDelete(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ success: true, message: 'Analysis deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, getAnalysisById, deleteAnalysis };
