import React from 'react';
import SkeletonStyles from './Skeletons.module.css';

const ActivitySkeletonSmall = () => {
	return (
		<>
			<div className={[SkeletonStyles.profile1, SkeletonStyles.skeleton].join(' ')} />
			<div style={{ marginTop: '1.5rem' }}>
				<div className={[SkeletonStyles.labelSkeleton2, SkeletonStyles.skeleton].join(' ')} />
				<div className={[SkeletonStyles.textBoxSkeleton2, SkeletonStyles.skeleton].join(' ')} />
			</div>
			<div>
				<div className={[SkeletonStyles.labelSkeleton2, SkeletonStyles.skeleton].join(' ')} />
				<div className={[SkeletonStyles.textBoxSkeleton2, SkeletonStyles.skeleton].join(' ')} />
			</div>
		</>)
};

export default ActivitySkeletonSmall;