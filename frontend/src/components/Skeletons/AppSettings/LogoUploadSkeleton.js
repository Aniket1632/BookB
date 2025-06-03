import React from 'react';
import SkeletonStyles from '../Skeletons.module.css';

const LogoUploadSkeleton = () => {
	return (
		<div className={SkeletonStyles.logoUploadContainer}>
			<div className={[ SkeletonStyles.logoUploadContainerImage, SkeletonStyles.skeleton ].join(' ')} />
		</div>
	);
};

export default LogoUploadSkeleton;
