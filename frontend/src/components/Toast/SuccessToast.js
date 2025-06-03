import React, { useState, useEffect } from 'react';
import styles from './SuccessToast.module.css';

const SuccessToast = ({ message, duration, onClose, showToast }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [preloaderKey, setPreloaderKey] = useState(0);

  useEffect(() => {
    setIsVisible(showToast);
    if (showToast) {
      setPreloaderKey(prevKey => prevKey + 1);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, showToast]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <>
    <div className={`${styles.toast} ${isVisible ? styles.show : ''} ${isVisible ? styles.slideInRight : styles.slideOutRight}`}>
    <div className={styles.iconMessageContainer}>
          <div style={{ display: 'inline-block' }}>
            <div className={styles.iconContainer}>
              <div className={styles.iconBackground}>&#10003;</div>
            </div>
          </div>
          <span>{message === '' ? 'Request Send' : message}</span>
        </div>
      <button className={styles.closeButton} onClick={handleClose}>
        &times;
      </button>
      <div key={preloaderKey} className={styles.preloaderContainer}>
          <div className={styles.preloader} />
        </div>
    </div>
    </>
  );
};

SuccessToast.defaultProps = {
  message: 'Request Send'
}
export default SuccessToast;

