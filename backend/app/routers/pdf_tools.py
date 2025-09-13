from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse
from typing import List, Optional
import os
import tempfile
import uuid
import logging
from app.services.pdf_service import PDFService
from app.services.file_service import FileService

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize services
pdf_service = PDFService()
file_service = FileService()

@router.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    """Merge multiple PDF files into one"""
    try:
        if len(files) < 2:
            raise HTTPException(status_code=400, detail="At least 2 PDF files are required for merging")
        
        # Validate all files are PDFs
        for file in files:
            if not file.filename.lower().endswith('.pdf'):
                raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF")
        
        # Save uploaded files temporarily
        temp_files = []
        for file in files:
            temp_path = await file_service.save_temp_file(file)
            temp_files.append(temp_path)
        
        try:
            # Merge PDFs
            output_path = await pdf_service.merge_pdfs(temp_files)
            
            # Return the merged file
            return FileResponse(
                output_path,
                media_type="application/pdf",
                filename="merged_document.pdf",
                headers={"Content-Disposition": "attachment; filename=merged_document.pdf"}
            )
        finally:
            # Clean up temp files
            for temp_path in temp_files:
                file_service.cleanup_file(temp_path)
            
    except Exception as e:
        logger.error(f"Error merging PDFs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error merging PDFs: {str(e)}")

@router.post("/get-page-count")
async def get_page_count(file: UploadFile = File(...)):
    """Get the accurate page count of a PDF file"""
    try:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Save uploaded file temporarily
        temp_path = await file_service.save_temp_file(file)
        
        try:
            # Get page count
            page_count = await pdf_service.get_page_count(temp_path)
            
            return {
                "page_count": page_count,
                "filename": file.filename,
                "success": True
            }
        finally:
            # Clean up temp files
            file_service.cleanup_file(temp_path)
            
    except Exception as e:
        logger.error(f"Error getting page count: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting page count: {str(e)}")

@router.post("/split")
async def split_pdf(
    file: UploadFile = File(...),
    split_mode: str = Form("all-pages"),  # "all-pages" or "custom-page"
    split_page: Optional[int] = Form(None),  # Page number to split at
    pages: Optional[str] = Form(None)  # Page ranges like "1-3,5,7-9"
):
    """Split a PDF into multiple files based on the specified mode"""
    try:
        # Debug logging
        logger.info(f"Split parameters - mode: {split_mode}, page: {split_page}, pages: {pages}, filename: {file.filename}")
        
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate split_mode
        if split_mode not in ["all-pages", "custom-page"]:
            raise HTTPException(status_code=400, detail=f"Invalid split mode: {split_mode}. Must be 'all-pages' or 'custom-page'")
        
        # Validate split_page for custom-page mode
        if split_mode == "custom-page":
            if split_page is None:
                raise HTTPException(status_code=400, detail="split_page is required when split_mode is 'custom-page'")
            if split_page < 1:
                raise HTTPException(status_code=400, detail="split_page must be a positive integer")
        
        # Save uploaded file temporarily
        temp_path = await file_service.save_temp_file(file)
        
        try:
            if split_mode == "custom-page" and split_page:
                # Split at specific page number
                output_paths = await pdf_service.split_at_page(temp_path, split_page)
            else:
                # Split into individual pages or extract specific pages
                output_paths = await pdf_service.split_pdf(temp_path, pages)
            
            # Always create zip file for split operations to ensure all files are downloadable
            if not output_paths:
                raise HTTPException(status_code=500, detail="No files were generated during the split operation")
            
            zip_path = await file_service.create_zip(output_paths, "split_pages.zip")
            return FileResponse(
                zip_path,
                media_type="application/zip",
                filename="split_pages.zip",
                headers={"Content-Disposition": "attachment; filename=split_pages.zip"}
            )
        finally:
            # Clean up temp files
            file_service.cleanup_file(temp_path)
            
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error splitting PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error splitting PDF: {str(e)}")

@router.post("/compress")
async def compress_pdf(file: UploadFile = File(...)):
    """Compress a PDF file to reduce its size"""
    try:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Save uploaded file temporarily
        temp_path = await file_service.save_temp_file(file)
        
        try:
            # Compress PDF
            output_path = await pdf_service.compress_pdf(temp_path)
            
            return FileResponse(
                output_path,
                media_type="application/pdf",
                filename="compressed_document.pdf",
                headers={"Content-Disposition": "attachment; filename=compressed_document.pdf"}
            )
        finally:
            # Clean up temp files
            file_service.cleanup_file(temp_path)
            
    except Exception as e:
        logger.error(f"Error compressing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error compressing PDF: {str(e)}")

@router.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    """Convert PDF to Word document"""
    try:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Save uploaded file temporarily
        temp_path = await file_service.save_temp_file(file)
        
        try:
            # Convert PDF to Word
            output_path = await pdf_service.pdf_to_word(temp_path)
            
            return FileResponse(
                output_path,
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                filename="converted_document.docx",
                headers={"Content-Disposition": "attachment; filename=converted_document.docx"}
            )
        finally:
            # Clean up temp files
            file_service.cleanup_file(temp_path)
            
    except Exception as e:
        logger.error(f"Error converting PDF to Word: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error converting PDF to Word: {str(e)}")

@router.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    """Convert Word document to PDF"""
    try:
        if not (file.filename.lower().endswith('.doc') or file.filename.lower().endswith('.docx')):
            raise HTTPException(status_code=400, detail="File must be a Word document (.doc or .docx)")
        
        # Save uploaded file temporarily
        temp_path = await file_service.save_temp_file(file)
        
        try:
            # Convert Word to PDF
            output_path = await pdf_service.word_to_pdf(temp_path)
            
            return FileResponse(
                output_path,
                media_type="application/pdf",
                filename="converted_document.pdf",
                headers={"Content-Disposition": "attachment; filename=converted_document.pdf"}
            )
        finally:
            # Clean up temp files
            file_service.cleanup_file(temp_path)
            
    except Exception as e:
        logger.error(f"Error converting Word to PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error converting Word to PDF: {str(e)}")