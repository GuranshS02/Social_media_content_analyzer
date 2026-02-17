const fs = require('fs');
const path = require('path');
const Analysis = require('../models/Analysis');
const { extractText } = require('../utils/textExtractor');
const { analyzeContent } = require('../utils/contentAnalyzer');

/**
 * POST /api/analyze
 * Upload a file and analyze its content
 */
const analyzeFile = async (req, res, next) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a PDF or image file.' });
    }

    filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Step 1: Extract text
    console.log(`📄 Extracting text from: ${req.file.originalname}`);
    const extractionResult = await extractText(filePath, mimeType);

    if (!extractionResult.text || extractionResult.text.trim().length < 5) {
      return res.status(422).json({ 
        error: 'Could not extract meaningful text from the file. Please ensure the file contains readable text.' 
      });
    }

    // Step 2: Analyze content
    console.log(`🔍 Analyzing content...`);
    const analysisResult = analyzeContent(extractionResult.text);

    // Step 3: Save to MongoDB
    const analysis = new Analysis({
      fileName: req.file.originalname,
      fileType: extractionResult.fileType,
      fileSize: req.file.size,
      extractedText: extractionResult.text,
      wordCount: analysisResult.wordCount,
      charCount: analysisResult.charCount,
      hashtags: analysisResult.hashtags,
      mentions: analysisResult.mentions,
      emojis: analysisResult.emojis,
      engagementScore: analysisResult.engagementScore,
      suggestions: analysisResult.suggestions,
      platform: analysisResult.platform,
      sentiment: analysisResult.sentiment
    });

    await analysis.save();
    console.log(`✅ Analysis saved with ID: ${analysis._id}`);

    // Step 4: Clean up uploaded file
    fs.unlinkSync(filePath);

    // Step 5: Return response
    res.status(200).json({
      success: true,
      message: 'File analyzed successfully!',
      data: {
        id: analysis._id,
        fileName: analysis.fileName,
        fileType: analysis.fileType,
        extractedText: analysis.extractedText,
        wordCount: analysis.wordCount,
        charCount: analysis.charCount,
        hashtags: analysis.hashtags,
        mentions: analysis.mentions,
        emojis: analysis.emojis,
        sentiment: analysis.sentiment,
        platform: analysis.platform,
        engagementScore: analysis.engagementScore,
        suggestions: analysis.suggestions,
        createdAt: analysis.createdAt
      }
    });

  } catch (error) {
    // Clean up file if error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error('Analysis error:', error.message);
    next(error);
  }
};

module.exports = { analyzeFile };
