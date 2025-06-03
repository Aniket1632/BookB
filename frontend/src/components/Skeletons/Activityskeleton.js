import React from 'react';
import SkeletonStyles from './Skeletons.module.css';

const ActivitySkeleton = () => {
	return (
		<>
			<div className={[SkeletonStyles.profile1, SkeletonStyles.skeleton].join(' ')} />
			<div style={{ marginTop: '1.5rem' }}>
				<div className={[SkeletonStyles.labelSkeleton1, SkeletonStyles.skeleton].join(' ')} />
				<div className={[SkeletonStyles.textBoxSkeleton1, SkeletonStyles.skeleton].join(' ')} />
			</div>
			<div>
				<div className={[SkeletonStyles.labelSkeleton1, SkeletonStyles.skeleton].join(' ')} />
				<div className={[SkeletonStyles.textBoxSkeleton1, SkeletonStyles.skeleton].join(' ')} />
			</div>
		</>)
};

export default ActivitySkeleton;