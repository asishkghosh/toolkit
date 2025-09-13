import os
import tempfile
import uuid
import shutil
from typing import Tuple, Optional
import logging
from PIL import Image, ImageOps, ImageEnhance
import io

logger = logging.getLogger(__name__)

class ImageService:
    """Service class for image operations"""
    
    def __init__(self):
        self.temp_dir = tempfile.gettempdir()
    
    async def resize_image(self, image_path: str, width: Optional[int] = None, height: Optional[int] = None) -> str:
        """Resize image to specified dimensions while maintaining aspect ratio if only one dimension is provided"""
        try:
            with Image.open(image_path) as img:
                original_width, original_height = img.size
                
                # Convert to RGB if necessary (for JPEG output)
                if img.mode in ('RGBA', 'LA'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Calculate new dimensions
                if width and height:
                    # Both dimensions specified - resize exactly
                    new_size = (width, height)
                elif width:
                    # Only width specified - maintain aspect ratio
                    aspect_ratio = original_height / original_width
                    new_size = (width, int(width * aspect_ratio))
                elif height:
                    # Only height specified - maintain aspect ratio
                    aspect_ratio = original_width / original_height
                    new_size = (int(height * aspect_ratio), height)
                else:
                    raise ValueError("At least one dimension must be specified")
                
                # Resize with high-quality resampling
                resized_img = img.resize(new_size, Image.Resampling.LANCZOS)
                
                # Generate output path
                output_path = os.path.join(self.temp_dir, f"resized_{uuid.uuid4().hex}.jpg")
                
                # Save resized image
                resized_img.save(output_path, 'JPEG', quality=95, optimize=True)
                
                logger.info(f"Successfully resized image from {original_width}x{original_height} to {new_size[0]}x{new_size[1]}")
                return output_path
                
        except Exception as e:
            logger.error(f"Error resizing image: {str(e)}")
            raise
    
    async def resize_image_advanced(self, image_path: str, width: Optional[int] = None, height: Optional[int] = None, 
                                  resize_type: str = "pixels", percentage: Optional[float] = None, 
                                  maintain_aspect_ratio: bool = True) -> str:
        """Advanced resize image with pixel/percentage options and aspect ratio control"""
        try:
            with Image.open(image_path) as img:
                original_width, original_height = img.size
                
                # Convert to RGB if necessary (for JPEG output)
                if img.mode in ('RGBA', 'LA'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Calculate new dimensions based on resize type
                if resize_type == "percentage":
                    if not percentage or percentage <= 0:
                        raise ValueError("Valid percentage must be specified for percentage resize")
                    
                    # Calculate new dimensions based on percentage
                    scale_factor = percentage / 100.0
                    new_width = int(original_width * scale_factor)
                    new_height = int(original_height * scale_factor)
                    new_size = (new_width, new_height)
                    
                    logger.info(f"Percentage resize: {percentage}% scale = {new_width}x{new_height}")
                    
                elif resize_type == "pixels":
                    if maintain_aspect_ratio:
                        # Maintain aspect ratio
                        if width and height:
                            # Both dimensions provided - choose the one that results in smaller scaling
                            width_scale = width / original_width
                            height_scale = height / original_height
                            scale = min(width_scale, height_scale)
                            new_width = int(original_width * scale)
                            new_height = int(original_height * scale)
                        elif width:
                            # Only width specified - maintain aspect ratio
                            aspect_ratio = original_height / original_width
                            new_width = width
                            new_height = int(width * aspect_ratio)
                        elif height:
                            # Only height specified - maintain aspect ratio
                            aspect_ratio = original_width / original_height
                            new_width = int(height * aspect_ratio)
                            new_height = height
                        else:
                            raise ValueError("At least one dimension must be specified for pixel resize")
                    else:
                        # Don't maintain aspect ratio - use exact dimensions
                        if not width or not height:
                            raise ValueError("Both width and height must be specified when not maintaining aspect ratio")
                        new_width = width
                        new_height = height
                    
                    new_size = (new_width, new_height)
                    logger.info(f"Pixel resize: {original_width}x{original_height} -> {new_width}x{new_height} (maintain aspect ratio: {maintain_aspect_ratio})")
                    
                else:
                    raise ValueError(f"Invalid resize_type: {resize_type}. Must be 'pixels' or 'percentage'")
                
                # Validate new dimensions
                if new_size[0] <= 0 or new_size[1] <= 0:
                    raise ValueError(f"Invalid dimensions: {new_size[0]}x{new_size[1]}")
                
                # Resize with high-quality resampling
                resized_img = img.resize(new_size, Image.Resampling.LANCZOS)
                
                # Generate output path
                output_path = os.path.join(self.temp_dir, f"resized_{uuid.uuid4().hex}.jpg")
                
                # Save resized image
                resized_img.save(output_path, 'JPEG', quality=95, optimize=True)
                
                logger.info(f"Successfully resized image from {original_width}x{original_height} to {new_size[0]}x{new_size[1]} using {resize_type} method")
                return output_path
                
        except Exception as e:
            logger.error(f"Error resizing image (advanced): {str(e)}")
            raise
    
    async def compress_image(self, image_path: str, quality: int = 85) -> str:
        """Advanced lossless image compression with multiple optimization techniques"""
        try:
            with Image.open(image_path) as img:
                original_size = os.path.getsize(image_path)
                original_width, original_height = img.size
                
                logger.info(f"Starting compression of {original_width}x{original_height} image ({original_size} bytes)")
                
                # Try different compression strategies and pick the best one
                best_path = None
                best_size = float('inf')
                best_format = "PNG (lossless)"  # default format
                
                # Strategy 1: PNG with maximum compression (lossless)
                png_path = await self._compress_as_png(img, "png_max")
                png_size = os.path.getsize(png_path)
                if png_size < best_size:
                    if best_path and os.path.exists(best_path):
                        os.remove(best_path)
                    best_path = png_path
                    best_size = png_size
                    best_format = "PNG (lossless)"
                else:
                    os.remove(png_path)
                
                # Strategy 2: WebP lossless compression
                webp_path = await self._compress_as_webp_lossless(img)
                webp_size = os.path.getsize(webp_path)
                if webp_size < best_size:
                    if best_path and os.path.exists(best_path):
                        os.remove(best_path)
                    best_path = webp_path
                    best_size = webp_size
                    best_format = "WebP (lossless)"
                else:
                    os.remove(webp_path)
                
                # Strategy 3: JPEG with optimized settings (if quality allows some loss)
                if quality < 100:  # Only use JPEG if some quality loss is acceptable
                    jpeg_path = await self._compress_as_jpeg_optimized(img, quality)
                    jpeg_size = os.path.getsize(jpeg_path)
                    if jpeg_size < best_size:
                        if best_path and os.path.exists(best_path):
                            os.remove(best_path)
                        best_path = jpeg_path
                        best_size = jpeg_size
                        best_format = f"JPEG (quality {quality})"
                    else:
                        os.remove(jpeg_path)
                
                # Strategy 4: TIFF with LZW compression (lossless)
                tiff_path = await self._compress_as_tiff_lzw(img)
                tiff_size = os.path.getsize(tiff_path)
                if tiff_size < best_size:
                    if best_path and os.path.exists(best_path):
                        os.remove(best_path)
                    best_path = tiff_path
                    best_size = tiff_size
                    best_format = "TIFF (LZW)"
                else:
                    os.remove(tiff_path)
                
                # Calculate compression statistics
                compression_ratio = (1 - best_size / original_size) * 100
                
                # Generate final output path with appropriate extension
                if "PNG" in best_format:
                    extension = "png"
                elif "WebP" in best_format:
                    extension = "webp"
                elif "JPEG" in best_format:
                    extension = "jpg"
                elif "TIFF" in best_format:
                    extension = "tiff"
                else:
                    extension = "png"  # fallback
                
                final_output_path = os.path.join(self.temp_dir, f"compressed_{uuid.uuid4().hex}.{extension}")
                
                # Move the best result to final path
                if best_path and os.path.exists(best_path):
                    import shutil
                    shutil.move(best_path, final_output_path)
                else:
                    raise Exception("No valid compression result generated")
                
                logger.info(f"Successfully compressed image: {compression_ratio:.1f}% reduction using {best_format} (from {original_size} to {best_size} bytes)")
                return final_output_path
                
        except Exception as e:
            logger.error(f"Error compressing image: {str(e)}")
            raise
    
    async def _compress_as_png(self, img: Image.Image, mode: str = "png_max") -> str:
        """Compress image as PNG with maximum compression settings"""
        try:
            # Remove metadata and optimize color palette
            optimized_img = self._optimize_image_for_compression(img)
            
            output_path = os.path.join(self.temp_dir, f"temp_png_{uuid.uuid4().hex}.png")
            
            # PNG compression settings for maximum compression
            save_kwargs = {
                'format': 'PNG',
                'optimize': True,
                'compress_level': 9,  # Maximum compression
            }
            
            # Convert to palette mode if possible for better compression
            if optimized_img.mode in ('RGB', 'RGBA'):
                # Try to convert to palette mode if image has limited colors
                try:
                    palette_img = optimized_img.quantize(colors=256)
                    # Check if conversion is beneficial
                    temp_path = os.path.join(self.temp_dir, f"temp_palette_test_{uuid.uuid4().hex}.png")
                    palette_img.save(temp_path, **save_kwargs)
                    
                    # If palette version is significantly smaller, use it
                    original_temp_path = os.path.join(self.temp_dir, f"temp_original_test_{uuid.uuid4().hex}.png")
                    optimized_img.save(original_temp_path, **save_kwargs)
                    
                    palette_size = os.path.getsize(temp_path)
                    original_size = os.path.getsize(original_temp_path)
                    
                    if palette_size < original_size * 0.9:  # If at least 10% smaller
                        optimized_img = palette_img
                    
                    # Clean up test files
                    os.remove(temp_path)
                    os.remove(original_temp_path)
                    
                except Exception:
                    # If palette conversion fails, continue with original
                    pass
            
            optimized_img.save(output_path, **save_kwargs)
            return output_path
            
        except Exception as e:
            logger.error(f"Error in PNG compression: {str(e)}")
            raise
    
    async def _compress_as_webp_lossless(self, img: Image.Image) -> str:
        """Compress image as WebP with lossless compression"""
        try:
            optimized_img = self._optimize_image_for_compression(img)
            
            output_path = os.path.join(self.temp_dir, f"temp_webp_{uuid.uuid4().hex}.webp")
            
            # WebP lossless compression settings
            save_kwargs = {
                'format': 'WEBP',
                'lossless': True,
                'quality': 100,
                'method': 6,  # Maximum compression effort
                'optimize': True
            }
            
            optimized_img.save(output_path, **save_kwargs)
            return output_path
            
        except Exception as e:
            logger.error(f"Error in WebP lossless compression: {str(e)}")
            raise
    
    async def _compress_as_jpeg_optimized(self, img: Image.Image, quality: int) -> str:
        """Compress image as JPEG with advanced optimization"""
        try:
            # Convert to RGB for JPEG
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                optimized_img = background
            elif img.mode != 'RGB':
                optimized_img = img.convert('RGB')
            else:
                optimized_img = img.copy()
            
            # Remove metadata
            optimized_img = self._optimize_image_for_compression(optimized_img)
            
            output_path = os.path.join(self.temp_dir, f"temp_jpeg_{uuid.uuid4().hex}.jpg")
            
            # Advanced JPEG compression settings
            save_kwargs = {
                'format': 'JPEG',
                'quality': quality,
                'optimize': True,
                'progressive': True,  # Progressive JPEG for better compression
                'subsampling': 0 if quality > 90 else 2,  # Better subsampling for high quality
            }
            
            optimized_img.save(output_path, **save_kwargs)
            return output_path
            
        except Exception as e:
            logger.error(f"Error in JPEG optimization: {str(e)}")
            raise
    
    async def _compress_as_tiff_lzw(self, img: Image.Image) -> str:
        """Compress image as TIFF with LZW compression"""
        try:
            optimized_img = self._optimize_image_for_compression(img)
            
            output_path = os.path.join(self.temp_dir, f"temp_tiff_{uuid.uuid4().hex}.tiff")
            
            # TIFF with LZW compression (lossless)
            save_kwargs = {
                'format': 'TIFF',
                'compression': 'lzw',
                'optimize': True
            }
            
            optimized_img.save(output_path, **save_kwargs)
            return output_path
            
        except Exception as e:
            logger.error(f"Error in TIFF LZW compression: {str(e)}")
            raise
    
    def _optimize_image_for_compression(self, img: Image.Image) -> Image.Image:
        """Optimize image for better compression by removing metadata and optimizing color space"""
        try:
            # Create a copy without metadata
            optimized_img = img.copy()
            
            # Remove EXIF and other metadata
            if hasattr(optimized_img, 'getexif'):
                optimized_img = optimized_img._new(optimized_img.im)
            
            # Remove any embedded profiles
            if 'icc_profile' in optimized_img.info:
                del optimized_img.info['icc_profile']
            
            # Remove other metadata
            for key in list(optimized_img.info.keys()):
                if key not in ['transparency', 'gamma']:  # Keep essential info
                    del optimized_img.info[key]
            
            return optimized_img
            
        except Exception as e:
            logger.warning(f"Could not optimize image metadata: {str(e)}")
            return img.copy()
    
    async def crop_image(self, image_path: str, x: int, y: int, width: int, height: int) -> str:
        """Crop image to specified area"""
        try:
            with Image.open(image_path) as img:
                original_width, original_height = img.size
                
                # Validate crop area
                if x < 0 or y < 0:
                    raise ValueError("Crop coordinates cannot be negative")
                if x + width > original_width or y + height > original_height:
                    raise ValueError("Crop area extends beyond image boundaries")
                
                # Crop image
                crop_box = (x, y, x + width, y + height)
                cropped_img = img.crop(crop_box)
                
                # Convert to RGB if necessary (for JPEG output)
                if cropped_img.mode in ('RGBA', 'LA'):
                    background = Image.new('RGB', cropped_img.size, (255, 255, 255))
                    background.paste(cropped_img, mask=cropped_img.split()[-1] if cropped_img.mode == 'RGBA' else None)
                    cropped_img = background
                elif cropped_img.mode != 'RGB':
                    cropped_img = cropped_img.convert('RGB')
                
                # Generate output path
                output_path = os.path.join(self.temp_dir, f"cropped_{uuid.uuid4().hex}.jpg")
                
                # Save cropped image
                cropped_img.save(output_path, 'JPEG', quality=95, optimize=True)
                
                logger.info(f"Successfully cropped image from {original_width}x{original_height} to {width}x{height}")
                return output_path
                
        except Exception as e:
            logger.error(f"Error cropping image: {str(e)}")
            raise
    
    async def get_image_dimensions(self, image_path: str) -> Tuple[int, int]:
        """Get image dimensions"""
        try:
            with Image.open(image_path) as img:
                width, height = img.size
                logger.info(f"Image dimensions: {width}x{height}")
                return (width, height)
                
        except Exception as e:
            logger.error(f"Error getting image dimensions: {str(e)}")
            raise
    
    async def enhance_image(self, image_path: str, brightness: float = 1.0, contrast: float = 1.0, sharpness: float = 1.0) -> str:
        """Enhance image with brightness, contrast, and sharpness adjustments"""
        try:
            with Image.open(image_path) as img:
                # Apply enhancements
                if brightness != 1.0:
                    enhancer = ImageEnhance.Brightness(img)
                    img = enhancer.enhance(brightness)
                
                if contrast != 1.0:
                    enhancer = ImageEnhance.Contrast(img)
                    img = enhancer.enhance(contrast)
                
                if sharpness != 1.0:
                    enhancer = ImageEnhance.Sharpness(img)
                    img = enhancer.enhance(sharpness)
                
                # Convert to RGB if necessary (for JPEG output)
                if img.mode in ('RGBA', 'LA'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Generate output path
                output_path = os.path.join(self.temp_dir, f"enhanced_{uuid.uuid4().hex}.jpg")
                
                # Save enhanced image
                img.save(output_path, 'JPEG', quality=95, optimize=True)
                
                logger.info(f"Successfully enhanced image (brightness: {brightness}, contrast: {contrast}, sharpness: {sharpness})")
                return output_path
                
        except Exception as e:
            logger.error(f"Error enhancing image: {str(e)}")
            raise
    
    async def auto_orient_image(self, image_path: str) -> str:
        """Auto-orient image based on EXIF data"""
        try:
            with Image.open(image_path) as img:
                # Auto-orient based on EXIF data
                oriented_img = ImageOps.exif_transpose(img)
                
                # If exif_transpose returns None, use original image
                if oriented_img is None:
                    oriented_img = img
                
                # Convert to RGB if necessary (for JPEG output)
                if oriented_img.mode in ('RGBA', 'LA'):
                    background = Image.new('RGB', oriented_img.size, (255, 255, 255))
                    background.paste(oriented_img, mask=oriented_img.split()[-1] if oriented_img.mode == 'RGBA' else None)
                    oriented_img = background
                elif oriented_img.mode != 'RGB':
                    oriented_img = oriented_img.convert('RGB')
                
                # Generate output path
                output_path = os.path.join(self.temp_dir, f"oriented_{uuid.uuid4().hex}.jpg")
                
                # Save oriented image
                oriented_img.save(output_path, 'JPEG', quality=95, optimize=True)
                
                logger.info(f"Successfully auto-oriented image")
                return output_path
                
        except Exception as e:
            logger.error(f"Error auto-orienting image: {str(e)}")
            raise