const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const fs = require('fs');

/**
 * Extract text from a PDF file
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return {
      text: data.text.trim(),
      pages: data.numpages,
      info: data.info
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

/**
 * Extract text from an image using Tesseract OCR
 */
const extractTextFromImage = async (filePath) => {
  try {
    const worker = await Tesseract.createWorker('eng');
    const { data: { text, confidence } } = await worker.recognize(filePath);
    await worker.terminate();
    return {
      text: text.trim(),
      confidence: confidence
    };
  } catch (error) {
    throw new Error(`OCR extraction failed: ${error.message}`);
  }
};

/**
 * Main function: detect file type and extract text
 */
const extractText = async (filePath, mimeType) => {
  const isPDF = mimeType === 'application/pdf';
  
  if (isPDF) {
    const result = await extractTextFromPDF(filePath);
    return { ...result, fileType: 'pdf' };
  } else {
    const result = await extractTextFromImage(filePath);
    return { ...result, fileType: 'image' };
  }
};

module.exports = { extractText, extractTextFromPDF, extractTextFromImage };
