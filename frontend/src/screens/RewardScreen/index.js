// import React, { useState } from 'react';
// import Styles from './RewardScreen.module.css'; // Assuming you have CSS modules set up
// import Content from '../../components/Content/Content';
// import RewardBadgeIcon from '../../Assets/reward-badge-icon.png'
// import RewardContent from '../../components/RewardContent/Content';
// import DescriptionModel from './RewardDescriptionModel'
// import ReadMore from '../../components/Readmore';



// const RewardScreen = () => {

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalContent, setModalContent] = useState({ title: '', description: '' });

//   const rewards = [
//     { id: 1, title: 'Create Account and Signup.', value: '+50 Coins', description: 'Sign up and create your BookB client profile.' },
//     { id: 2, title: 'Book Your First Appointment.', value: '+40 Coins', description: 'Schedule and attend your first appointment through the BookB platform.' },
//     { id: 3, title: 'Complete Your Profile.', value: '+30 Coins', description: 'Fill out and save your personal profile, including preferences and contact information.' },
//     { id: 4, title: 'Refer a Friend.', value: '+100 Coins', description: 'Successfully refer a friend who books their first appointment.' },
//     { id: 5, title: 'Leave a Review.', value: '+20 Coins', description: 'Write and submit a review after your appointment.' },
//     { id: 6, title: 'Share on Social Media.', value: '+15 Coins', description: 'Share your salon experience on social media and tag the salon.' },
//   ];

//   const [completedGoals, setCompletedGoals] = useState(3);
//   const totalGoals = 20;

//   const handleChange = (event) => {
//     setCompletedGoals(event.target.value);
//   };

//   const openModal = (title, description) => {
//     setModalContent({ title, description });
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <RewardContent showHeader={false}>
//       <div className={Styles.banner}>
//         <div className={Styles.coinsCount}>
//           <div className={Styles.coinsContent}>
//             <img src='/assets/coinsstack.png' alt='logo' className={Styles.bannerCoin} />
//             <span className={Styles.totalCoins}>255</span>
//             <span className={Styles.outOfCoins}>/500</span>
//           </div>
//           <span className={Styles.totalCoinsText}>Total coins</span>
//         </div>
//       </div>
//       <div className={Styles.container}>
//         <h2 className={Styles.heading}>Goals</h2>
//         <div className={Styles.grid}>
//           {rewards.map((reward) => (
//             <div key={reward.id} className={Styles.card}>
//               <div className={Styles.rewardBadge}>
//                 <img src={RewardBadgeIcon} alt="" className={Styles.badgeIcon} />
//               </div>
//               <div className={Styles.rewardValueContainer}>
//                 <span className={Styles.rewardValue}>{reward.value.split(' ')[0]}</span>
//                 <span className={Styles.coinsText}>Coins</span>
//               </div>
//               <p className={Styles.rewardTitle}>{reward.title}</p>
//               <button
//                 className={Styles.readMoreButton}
//                 onClick={() => openModal(reward.title, reward.description)} >
//                 Read More
//               </button>
//               <div className={Styles.slider}>
//                 <div className={Styles.goalSlider}>
//                   {/* <input
//                     type="range"
//                     min="0"
//                     max={totalGoals}
//                     value={completedGoals}
//                     className={Styles.customSlider}
//                     onChange={handleChange}
//                   /> */}
//                   <div className={Styles.progressBarBackground}>
//                     <div className={Styles.progressBarFill} style={{ width: `${(completedGoals / totalGoals) * 100}%` }} />
//                   </div>
//                   <div className={Styles.completedGoals}>( {completedGoals}/{totalGoals} Goals completed )</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <DescriptionModel
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         title={modalContent.title}
//         content={modalContent.description}
//       />
//     </RewardContent>
//   );
// };

// export default RewardScreen;
