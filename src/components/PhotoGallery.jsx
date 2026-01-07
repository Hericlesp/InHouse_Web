import { useState } from 'react';
import './PhotoGallery.css';

const PhotoGallery = ({ photos = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!photos || photos.length === 0) {
        return (
            <div className="photo-gallery-empty">
                <span className="empty-icon">📷</span>
                <p>Sem fotos disponíveis</p>
            </div>
        );
    }

    // Parse photos if it's a JSON string
    const photoArray = typeof photos === 'string' ? JSON.parse(photos) : photos;

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? photoArray.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === photoArray.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="photo-gallery">
            <div className="gallery-main">
                <img
                    src={photoArray[currentIndex]}
                    alt={`Foto ${currentIndex + 1}`}
                    className="gallery-image"
                />

                {photoArray.length > 1 && (
                    <>
                        <button className="gallery-nav prev" onClick={goToPrevious}>
                            ‹
                        </button>
                        <button className="gallery-nav next" onClick={goToNext}>
                            ›
                        </button>
                    </>
                )}

                <div className="gallery-counter">
                    {currentIndex + 1} / {photoArray.length}
                </div>
            </div>

            {photoArray.length > 1 && (
                <div className="gallery-thumbnails">
                    {photoArray.map((photo, index) => (
                        <div
                            key={index}
                            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <img src={photo} alt={`Thumbnail ${index + 1}`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;
