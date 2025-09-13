from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from typing import Optional
import os
import tempfile
import uuid
import logging
from app.services.image_service import ImageService
from app.services.file_service import FileService

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize services
image_service = ImageService()
file_service = FileService()

@router.post("/resize")
async def resize_image(
    file: UploadFile = File(...),
    width: Optional[int] = Form(None),
    height: Optional[int] = Form(None),
    resize_type: Optional[str] = Form("pixels"),
    percentage: Optional[float] = Form(None),
    maintain_aspect_ratio: Optional[str] = Form("true")
):
    """Resize image with advanced options including percentage and aspect ratio control"""
    try:
        if not file.filename or not file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp')):
            raise HTTPException(status_code=400, detail="File must be a valid image format")
        
        # Convert string boolean to actual boolean
        maintain_ratio = maintain_aspect_ratio.lower() == "true"
        
        # Validate parameters based on resize type
        if resize_type == "percentage":
            if not percentage or percentage <= 0:
                raise HTTPException(status_code=400, detail="Percentage must be specified and greater than 0")
        elif resize_type == "pixels":
            if not width and not height:
                raise HTTPException(status_code=400, detail="At least one dimension (width or height) must be specified for pixel resize")
        else:
            raise HTTPException(status_code=400, detail="Resize type must be 'pixels' or 'percentage'")
        
        # Save uploaded file temporarily
        temp_path = await file_service.save_temp_file(file)
        
        try:
            # Resize image with new parameters
            output_path = await image_service.resize_image_advanced(
                temp_path, 
                width, 
                height, 
                resize_type, 
                percentage, 
                maintain_ratio
            )
            
            return FileResponse(
                output_path,
                media_type=file_service.get_mime_type(output_path),
                filename="resized_image.jpg",
                headers={"Content-Disposition": "attachment; filename=resized_image.jpg"}
            )
        finally:
            # Clean up temp files
            file_service.cleanup_file(temp_path)
            
    except Exception as e:
        logger.error(f"Error resizing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error resizing image: {str(e)}")

@router.post("/compress")
async def compress_image(
    file: UploadFile = File(...),
    quality: int = Form(85)
):
    """Compress image with specified quality"""
    try:
        if not file.filename or not file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp')):
            raise HTTPException(status_code=400, detail="File must be a valid image format")
        
        if quality < 10 or quality > 100:
            raise HTTPException(status_code=400, detail="Quality must be between 10 and 100")
        
        # Save uploaded file temporarily
        temp_path = await file_service.save_temp_file(file)
        
        try:
            # Compress image
            output_path = await image_service.compress_image(temp_path, quality)
            
            return FileResponse(
                output_path,
                media_type=file_service.get_mime_type(output_path),
                filename="compressed_image.jpg",
                headers={"Content-Disposition": "attachment; filename=compressed_image.jpg"}
            )
        finally:
            # Clean up temp files
            file_service.cleanup_file(temp_path)
            
    except Exception as e:
        logger.error(f"Error compressing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error compressing image: {str(e)}")

@router.get("/supported-formats")
async def get_supported_formats():
    """Get list of supported image formats - simplified version"""
    try:
        # Return a basic set of supported formats
        formats_list = [
            {'key': 'jpg', 'name': 'JPEG', 'extension': 'jpg', 'description': 'JPEG - Web standard', 'supports_transparency': False},
            {'key': 'png', 'name': 'PNG', 'extension': 'png', 'description': 'PNG - Lossless, transparency', 'supports_transparency': True},
            {'key': 'webp', 'name': 'WebP', 'extension': 'webp', 'description': 'WebP - Modern format', 'supports_transparency': True},
            {'key': 'bmp', 'name': 'BMP', 'extension': 'bmp', 'description': 'BMP - Windows bitmap', 'supports_transparency': False},
            {'key': 'tiff', 'name': 'TIFF', 'extension': 'tiff', 'description': 'TIFF - Professional', 'supports_transparency': True}
        ]
        
        return {
            'supported_formats': formats_list,
            'total_count': len(formats_list),
            'heic_supported': False
        }
        
    except Exception as e:
        logger.error(f"Error getting supported formats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting supported formats: {str(e)}")

@router.post("/crop")
async def crop_image(
    file: UploadFile = File(...),
    x: int = Form(...),
    y: int = Form(...),
    width: int = Form(...),
    height: int = Form(...)
):
    """Crop image to specified area"""
    try:
        if not file.filename or not file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp')):
            raise HTTPException(status_code=400, detail="File must be a valid image format")
        
        # Save uploaded file temporarily
        temp_path = await file_service.save_temp_file(file)
        
        try:
            # Crop image
            output_path = await image_service.crop_image(temp_path, x, y, width, height)
            
            return FileResponse(
                output_path,
                media_type=file_service.get_mime_type(output_path),
                filename="cropped_image.jpg",
                headers={"Content-Disposition": "attachment; filename=cropped_image.jpg"}
            )
        finally:
            # Clean up temp files
            file_service.cleanup_file(temp_path)
            
    except Exception as e:
        logger.error(f"Error cropping image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error cropping image: {str(e)}")