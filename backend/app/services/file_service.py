import os
import tempfile
import uuid
import zipfile
import aiofiles
from typing import List
from fastapi import UploadFile
import logging

logger = logging.getLogger(__name__)

class FileService:
    """Service class for file operations"""
    
    def __init__(self):
        self.temp_dir = tempfile.gettempdir()
        # Ensure temp directory exists
        os.makedirs(self.temp_dir, exist_ok=True)
    
    async def save_temp_file(self, file: UploadFile) -> str:
        """Save uploaded file to temporary location"""
        try:
            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1]
            temp_filename = f"{uuid.uuid4().hex}{file_extension}"
            temp_path = os.path.join(self.temp_dir, temp_filename)
            
            # Save file asynchronously
            async with aiofiles.open(temp_path, 'wb') as temp_file:
                content = await file.read()
                await temp_file.write(content)
            
            logger.info(f"Saved temp file: {temp_path}")
            return temp_path
            
        except Exception as e:
            logger.error(f"Error saving temp file: {str(e)}")
            raise
    
    def cleanup_file(self, file_path: str):
        """Remove temporary file"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Cleaned up temp file: {file_path}")
        except Exception as e:
            logger.error(f"Error cleaning up file {file_path}: {str(e)}")
    
    async def create_zip(self, file_paths: List[str], zip_name: str) -> str:
        """Create a zip file containing multiple files"""
        try:
            zip_path = os.path.join(self.temp_dir, zip_name)
            
            # Filter out non-existent files
            valid_file_paths = [path for path in file_paths if os.path.exists(path)]
            
            if not valid_file_paths:
                # Create an empty zip file with a placeholder
                with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    zipf.writestr("empty.txt", "No files were generated during the operation.")
                logger.warning("No valid files to zip, created empty zip with placeholder")
                return zip_path
            
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for i, file_path in enumerate(valid_file_paths):
                    if os.path.exists(file_path):
                        # Use the original descriptive filename
                        filename = os.path.basename(file_path)
                        
                        # For split operations, try to extract meaningful name from the path
                        if "part_" in filename:
                            # Keep the descriptive name (e.g., "part_1_pages_1-3_uuid.pdf")
                            parts = filename.split('_')
                            if len(parts) >= 3:
                                base_name = parts[0] + '_' + parts[1] + '_' + parts[2]
                                ext = os.path.splitext(filename)[1]
                                archive_name = base_name + ext
                            else:
                                archive_name = filename
                        elif "page_" in filename and len(valid_file_paths) > 2:
                            # Individual page files, use generic naming
                            base_name, ext = os.path.splitext(filename)
                            archive_name = f"page_{i+1}{ext}"
                        else:
                            # Default: use original filename without UUID
                            base_name, ext = os.path.splitext(filename)
                            # Remove UUID if present
                            name_parts = base_name.split('_')
                            if len(name_parts) > 1 and len(name_parts[-1]) == 32:  # UUID length
                                archive_name = '_'.join(name_parts[:-1]) + ext
                            else:
                                archive_name = filename
                        
                        zipf.write(file_path, archive_name)
                        
                        # Clean up individual file after adding to zip
                        self.cleanup_file(file_path)
            
            logger.info(f"Created zip file with {len(valid_file_paths)} files: {zip_path}")
            return zip_path
            
        except Exception as e:
            logger.error(f"Error creating zip file: {str(e)}")
            raise
    
    def get_file_size(self, file_path: str) -> int:
        """Get file size in bytes"""
        try:
            return os.path.getsize(file_path)
        except Exception as e:
            logger.error(f"Error getting file size for {file_path}: {str(e)}")
            return 0
    
    def validate_file_type(self, filename: str, allowed_extensions: List[str]) -> bool:
        """Validate file type based on extension"""
        file_extension = os.path.splitext(filename.lower())[1]
        return file_extension in [ext.lower() for ext in allowed_extensions]
    
    def get_mime_type(self, filename: str) -> str:
        """Get MIME type based on file extension"""
        extension = os.path.splitext(filename.lower())[1]
        
        mime_types = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.zip': 'application/zip',
            '.txt': 'text/plain',
        }
        
        return mime_types.get(extension, 'application/octet-stream')