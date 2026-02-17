# Social Media Content Analyzer

An AI-powered full-stack web application that analyzes social media posts from PDF and image files using OCR technology. Extracts text, evaluates engagement metrics, and provides actionable suggestions to improve content performance.

---

## 🚀 Features

- **PDF Parsing** – Extract text from PDF documents while preserving formatting
- **OCR (Image Text Extraction)** – Use Tesseract.js to extract text from JPG, PNG, and other image formats
- **Drag & Drop Upload** – Easy file upload with drag-and-drop or file picker
- **Engagement Scoring** – Score content across 5 key metrics: Readability, Hashtags, Call-to-Action, Sentiment, and Length
- **AI Suggestions** – Actionable recommendations to improve social media engagement
- **Content Analysis** – Auto-detect hashtags, mentions, emojis, sentiment, and platform
- **Analysis History** – View, revisit, and delete past analyses stored in MongoDB
- **Loading States** – Clear feedback during processing with progress messages

---

## 🛠 Tech Stack (MERN)

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **PDF Parsing** | pdf-parse |
| **OCR** | Tesseract.js |
| **File Upload** | Multer |
| **HTTP Client** | Axios |

---

## 📁 Project Structure

```
social-media-analyzer/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── analyzeController.js   # File upload & analysis logic
│   │   │   └── historyController.js   # CRUD for past analyses
│   │   ├── middleware/
│   │   │   └── upload.js              # Multer file upload config
│   │   ├── models/
│   │   │   └── Analysis.js            # MongoDB schema
│   │   ├── routes/
│   │   │   ├── analyze.js             # POST /api/analyze
│   │   │   └── history.js             # GET/DELETE /api/history
│   │   ├── utils/
│   │   │   ├── textExtractor.js       # PDF + OCR extraction
│   │   │   └── contentAnalyzer.js     # Scoring + suggestions
│   │   └── server.js                  # Express app entry point
│   ├── uploads/                        # Temp file storage (auto-cleaned)
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Header.tsx
    │   ├── pages/
    │   │   ├── UploadPage.tsx          # File upload UI
    │   │   ├── ResultsPage.tsx         # Analysis results display
    │   │   └── HistoryPage.tsx         # Past analyses list
    │   ├── utils/
    │   │   └── api.ts                  # Axios API calls
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Social-Media-Content-Analyzer.git
cd Social-Media-Content-Analyzer
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media-analyzer
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/social-media-analyzer
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Open App

Visit: **http://localhost:5173**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Upload & analyze a file |
| `GET` | `/api/history` | Get all past analyses |
| `GET` | `/api/history/:id` | Get single analysis |
| `DELETE` | `/api/history/:id` | Delete an analysis |
| `GET` | `/api/health` | Health check |

---

## 📊 Engagement Scoring

The app scores content across 5 dimensions (each 0-100):

- **Readability** – Ideal word count range for social posts
- **Hashtags** – Optimal hashtag count (3-10 recommended)
- **Call to Action** – Presence of engagement-driving words
- **Sentiment** – Positive, neutral, or negative tone
- **Content Length** – Character count relative to platform norms

---

## 🧪 Testing

Upload the following file types to test:

- **PDF**: A social media content calendar or marketing PDF
- **Image**: A screenshot of an Instagram, Twitter, or LinkedIn post (JPG/PNG)
- **Scanned Document**: Any scanned image with text

---

## 📝 Approach (Brief Write-up)

This application was built using the MERN stack to analyze social media content from uploaded files. The backend uses `pdf-parse` for PDF text extraction and `Tesseract.js` for OCR on image files. Extracted text is then scored across 5 engagement metrics using a custom algorithm that evaluates readability, hashtag usage, call-to-action presence, sentiment, and content length. Results and suggestions are stored in MongoDB and presented through a clean React frontend with drag-and-drop upload, real-time loading states, and an analysis history view.

---

## 📄 License

MIT License
