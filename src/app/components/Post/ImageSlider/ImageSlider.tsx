import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/app/components/Post/ImageSlider/ImageSlider.module.css';

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.sliderContainer}>
        <div className={styles.noImagePlaceholder}>📝</div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.sliderContainer}>
      <div
        className={styles.sliderTrack}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className={styles.slide}>
            <img src={img} alt="" className={styles.image} />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button className={`${styles.sliderButton} ${styles.sliderButtonLeft}`} onClick={goToPrevious}>
            <ChevronLeft size={20} />
          </button>

          <button className={`${styles.sliderButton} ${styles.sliderButtonRight}`} onClick={goToNext}>
            <ChevronRight size={20} />
          </button>

          <div className={styles.sliderDots}>
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
