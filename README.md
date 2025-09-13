# TealPDF - Modern PDF Toolkit

A minimalistic, modern web application for PDF processing built with React and FastAPI.

## 🎨 Features

- **Merge PDFs** - Combine multiple PDF files into one document
- **Split PDF** - Extract pages or split PDF into multiple files
- **Compress PDF** - Reduce file size while maintaining quality
- **PDF to Word** - Convert PDF files to editable Word documents
- **Word to PDF** - Convert Word documents to PDF format

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern styling
- **React Router** for navigation
- **Lucide React** for icons
- **Axios** for API communication

### Backend
- **FastAPI** for high-performance API
- **PyPDF2** for PDF manipulation
- **pdf2docx** for PDF to Word conversion
- **python-docx** for Word document handling
- **ReportLab** for PDF generation

## 📁 Project Structure

```
pdf-toolkit/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── vite.config.js
├── backend/                  # FastAPI backend application
│   ├── app/
│   │   ├── routers/         # API route handlers
│   │   ├── services/        # Business logic services
│   │   └── __init__.py
│   ├── requirements.txt
│   ├── main.py              # FastAPI app entry point
│   └── run.py               # Development server runner
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd pdf-toolkit/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd pdf-toolkit/backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   python run.py
   ```

The backend API will be available at `http://localhost:8000`

## 🌐 API Documentation

Once the backend is running, you can access:
- **Interactive API docs**: `http://localhost:8000/docs`
- **ReDoc documentation**: `http://localhost:8000/redoc`

### API Endpoints

- `POST /merge` - Merge multiple PDF files
- `POST /split` - Split PDF into pages or extract specific pages
- `POST /compress` - Compress PDF file size
- `POST /pdf-to-word` - Convert PDF to Word document
- `POST /word-to-pdf` - Convert Word document to PDF

## 🎯 Usage

1. **Start both servers** (frontend and backend)
2. **Open your browser** to `http://localhost:3000`
3. **Select a tool** from the homepage
4. **Upload your file(s)** using drag-and-drop or file picker
5. **Process the file(s)** by clicking the process button
6. **Download the result** once processing is complete

## 🔒 Security Features

- **File validation** - Only accepted file types are processed
- **Temporary storage** - Files are automatically deleted after processing
- **No data persistence** - No files are stored permanently
- **CORS protection** - Configured for secure cross-origin requests

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables for API URL

### Backend (Render/Railway)
1. Deploy the backend folder to your hosting platform
2. Install dependencies: `pip install -r requirements.txt`
3. Start with: `python main.py`

## 📝 Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL (default: `/api`)

### Backend
- No environment variables required for basic setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for simple, effective PDF tools
- Designed with user experience in mind

---

**TealPDF** - Making PDF processing simple and accessible for everyone.