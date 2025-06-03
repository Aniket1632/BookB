import React, { Fragment } from 'react';
import SkeletonStyles from './Skeletons.module.css';

const LoginSkeleton = () => {
	return (
		<Fragment>
			<div style={{ marginTop: '1.5rem' }}>
				<div className={[SkeletonStyles.labelSkeleton, SkeletonStyles.skeleton].join(' ')} />
				<div className={[SkeletonStyles.textBoxSkeleton, SkeletonStyles.skeleton].join(' ')} />
			</div>
			<div>
				<div className={[SkeletonStyles.labelSkeleton, SkeletonStyles.skeleton].join(' ')} />
				<div className={[SkeletonStyles.textBoxSkeleton, SkeletonStyles.skeleton].join(' ')} />
			</div>
			<div className={[SkeletonStyles.buttonSkeleton, SkeletonStyles.skeleton].join(' ')} />
			<div className={[SkeletonStyles.textSkeleton, SkeletonStyles.skeleton].join(' ')} />
			<div className={[SkeletonStyles.textSkeleton, SkeletonStyles.skeleton].join(' ')} />
		</Fragment>
	);
};

export default LoginSkeleton;
