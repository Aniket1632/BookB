import React, { useEffect, useRef, useState } from 'react';
import Lottie from "lottie-react";
import coinsAnimation from '../../Assets/coins.json'
import congratsAnimation from '../../Assets/congrats.json'
import congratsNewAnimation2 from '../../Assets/congrats.json'
// import congratsNewAnimation from '../../Assets/congrats3.json'
import congratsNewAnimation from '../../Assets/latestcongrats.json'
import Styles from './LoginRewardModal.module.css'


const LoginRewardModal = ({ isOpen, coins, onClose  }) => {
    const animationContainer = useRef(null);

  const [isVisible, setIsVisible] = useState(true);
    

  const handleAnimationComplete = () => {
    setTimeout(() => {
      setIsVisible(false); 
      onClose();
    }, 0); 
  };

  const lottieRef = useRef(null); 

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); 
    }
  }, []);

    return (
        <div className={Styles.modalOverlay}>
             {isVisible && (
                <div className={Styles.congratsAnimationContainer}>
                <Lottie animationData={congratsNewAnimation} loop={false} onComplete={handleAnimationComplete}/>
                </div>)}
        <div className={Styles.modalContent}>
        <button className={Styles.closeButton} onClick={onClose}>X</button>
         <div className={Styles.animationContainer}>
               <Lottie animationData={coinsAnimation} loop={false} height={380} width={380}    lottieRef={lottieRef}/>
                </div>
                <div className={Styles.animationTextContainer}>
                <h2 className={Styles.congratulationText}>Welcome to BookB 🥳</h2>
                <span className={Styles.coinText}>You have received
                    <p className={Styles.coins}>+{coins}</p>
                    <p> coins!</p>
                </span>
            </div>
            </div>
        </div>
    );
};

export default LoginRewardModal;