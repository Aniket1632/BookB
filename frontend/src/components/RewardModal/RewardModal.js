import React from "react";
import Styles from "./RewardModal.module.css";

const RewardModal = ({ showModal, onClose }) => {
    if (!showModal) return null;
    
    const goals = [
        {
          description: " Log In (50 Coins)",
          action: "Log in with BookB your credentials."
        },
        {
          description: " Complete Your Profile (30 Coins)",
          action: "Fill out and save your personal profile, including preferences and contact information."
        },
        {
          description: " Book Your First Appointment (40 Coins)",
          action: "Schedule or attend your first appointment through the BookB platform."
        },
      ];

  return (
    <div className={Styles.modalOverlay}>
      <div className={Styles.modalContent}>
        <div className={Styles.modalHeader}>
          <h2>Goals</h2>
          <button className={Styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={Styles.modalBody}>
        {goals.map((goal, index) => (
             <div className={Styles.goalItem} key={index}>
             <p className={Styles.goalDescription}>{index + 1}.{goal.description}</p>
             <p className={Styles.goalAction}><strong>Action:</strong> {goal.action}</p>
           </div>
         ))}
        </div>
        <div className={Styles.modalFooter}>
          <button className={Styles.closeModalButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
