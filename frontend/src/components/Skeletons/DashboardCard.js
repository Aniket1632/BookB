import React from 'react';
import SkeletonStyles from './Skeletons.module.css';

const DashboardCard = () => {
	const data = [ 1, 2, 3 ];
	return (
		<div className={SkeletonStyles.cardSkeletons}>
			<div className={[ SkeletonStyles.cardSkeleton, SkeletonStyles.skeleton ].join(' ')} />
			<div className={[ SkeletonStyles.cardSkeleton1, SkeletonStyles.skeleton ].join(' ')} />
			<div className={[ SkeletonStyles.cardSkeleton1, SkeletonStyles.skeleton ].join(' ')} />
		</div>
	);
};

export default DashboardCard;
