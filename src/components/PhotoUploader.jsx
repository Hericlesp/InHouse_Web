import { useState } from 'react';
import './PhotoUploader.css';

const PhotoUploader = ({ photos = [], onChange, maxPhotos = 5 }) => {
    const [previews, setPreviews] = useState(photos);

    const compressImage = (file, maxSizeKB = 500) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions (max 1200px)
                    const maxDimension = 1200;
                    if (width > height && width > maxDimension) {
                        height = (height / width) * maxDimension;
                        width = maxDimension;
                    } else if (height > maxDimension) {
                        width = (width / height) * maxDimension;
                        height = maxDimension;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG
                    let quality = 0.7;
                    let dataUrl = canvas.toDataURL('image/jpeg', quality);

                    // Reduce quality if still too large
                    while (dataUrl.length > maxSizeKB * 1024 && quality > 0.1) {
                        quality -= 0.1;
                        dataUrl = canvas.toDataURL('image/jpeg', quality);
                    }

                    resolve(dataUrl);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = maxPhotos - previews.length;

        if (files.length > remainingSlots) {
            alert(`Você pode adicionar no máximo ${maxPhotos} fotos.`);
            return;
        }

        const newPreviews = [];
        for (const file of files.slice(0, remainingSlots)) {
            const compressed = await compressImage(file);
            newPreviews.push(compressed);
        }

        const updated = [...previews, ...newPreviews];
        setPreviews(updated);
        onChange(updated);
    };

    const handleRemove = (index) => {
        const updated = previews.filter((_, i) => i !== index);
        setPreviews(updated);
        onChange(updated);
    };

    return (
        <div className="photo-uploader">
            <div className="photos-grid">
                {previews.map((photo, index) => (
                    <div key={index} className="photo-preview">
                        <img src={photo} alt={`Preview ${index + 1}`} />
                        <button
                            type="button"
                            className="remove-photo-btn"
                            onClick={() => handleRemove(index)}
                        >
                            ✕
                        </button>
                    </div>
                ))}

                {previews.length < maxPhotos && (
                    <label className="photo-upload-box">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <div className="upload-content">
                            <span className="upload-icon">📷</span>
                            <span className="upload-text">Adicionar Foto</span>
                            <span className="upload-count">
                                {previews.length}/{maxPhotos}
                            </span>
                        </div>
                    </label>
                )}
            </div>

            {previews.length > 0 && (
                <p className="upload-hint">
                    {previews.length} de {maxPhotos} fotos • Máx 500KB por foto
                </p>
            )}
        </div>
    );
};

export default PhotoUploader;
