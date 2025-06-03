import React from 'react';
import UserDetailsStyle from './userCard.module.css';

const HeadingCard = ({ label, count, icon, description }) => {
	return (
		<div className={UserDetailsStyle.headingCard}>
			<h2 className={UserDetailsStyle.headingCardTitle}>{label}</h2>
			<h2 className={UserDetailsStyle.headingCardContent}>
				<svg className={UserDetailsStyle.headingCardContentIcon}>
					<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
				</svg>
				{count}
			</h2>
			<p className={UserDetailsStyle.headingCardDesc}>{description}</p>
		</div>
	);
};

export default HeadingCard;
